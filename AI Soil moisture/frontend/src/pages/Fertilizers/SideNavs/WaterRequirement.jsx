import { useState, useEffect } from "react";

const WaterRequirement = () => {
    const [loading, setLoading] = useState(true);
    const [cameraError, setCameraError] = useState(false);
    const [locationError, setLocationError] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState({
        camera: '',
        location: ''
    });

    useEffect(() => {
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        // Check camera permission
        try {
            if ("mediaDevices" in navigator) {
                const result = await navigator.permissions.query({ name: 'camera' });
                if (result.state === 'granted') {
                    setCameraError(false);
                    setPermissionStatus(prev => ({ ...prev, camera: 'granted' }));
                } else if (result.state === 'prompt') {
                    requestCamera();
                } else {
                    setCameraError(true);
                    setPermissionStatus(prev => ({ ...prev, camera: 'denied' }));
                }
            }
        } catch (error) {
            console.error("Camera permission error:", error);
        }

        // Check location permission
        if ("geolocation" in navigator) {
            const locationResult = await navigator.permissions.query({ name: 'geolocation' });
            if (locationResult.state === 'granted') {
                setLocationError(false);
                setPermissionStatus(prev => ({ ...prev, location: 'granted' }));
            } else if (locationResult.state === 'prompt') {
                requestLocation();
            } else {
                setLocationError(true);
                setPermissionStatus(prev => ({ ...prev, location: 'denied' }));
            }
        }
    };

    const requestCamera = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraError(false);
            setPermissionStatus(prev => ({ ...prev, camera: 'granted' }));
        } catch (error) {
            console.error("Camera access error:", error);
            setCameraError(true);
            setPermissionStatus(prev => ({ ...prev, camera: 'denied' }));
        }
    };

    const requestLocation = () => {
        navigator.geolocation.getCurrentPosition(
            () => {
                setLocationError(false);
                setPermissionStatus(prev => ({ ...prev, location: 'granted' }));
            },
            () => {
                setLocationError(true);
                setPermissionStatus(prev => ({ ...prev, location: 'denied' }));
            }
        );
    };

    const handleRetryPermissions = async () => {
        setLoading(true);
        await checkPermissions();
        // Reload iframe after getting permissions
        const iframe = document.querySelector('iframe');
        if (iframe) {
            iframe.src = iframe.src;
        }
    };

    const handleIframeLoad = () => {
        if (!cameraError && !locationError) {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: "relative", height: "100vh", width: "100%" }}>
            {loading && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1,
                    }}
                >
                    <div className="loader">Loading...</div>
                </div>
            )}

            {(cameraError || locationError) && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        zIndex: 2,
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        maxWidth: "400px"
                    }}
                >
                    <h3>Permissions Required</h3>
                    {cameraError && (
                        <div style={{ marginBottom: "15px" }}>
                            <p><strong>Camera Access Required</strong></p>
                            <p>Please enable camera access to use this feature.</p>
                        </div>
                    )}
                    {locationError && (
                        <div style={{ marginBottom: "15px" }}>
                            <p><strong>Location Access Required</strong></p>
                            <p>Please enable location access to use this feature.</p>
                        </div>
                    )}
                    
                    <div style={{ marginTop: "10px", fontSize: "14px", textAlign: "left" }}>
                        <p><strong>To enable permissions in Chrome/Edge:</strong></p>
                        <ol>
                            <li>Click the lock/info icon in the address bar</li>
                            <li>Click "Site settings"</li>
                            <li>Find "Camera" and "Location"</li>
                            <li>Change both settings to "Allow"</li>
                        </ol>
                        <p><strong>In Firefox:</strong></p>
                        <ol>
                            <li>Click the lock/info icon in the address bar</li>
                            <li>Clear the current settings</li>
                            <li>Refresh the page</li>
                            <li>Allow both permissions when prompted</li>
                        </ol>
                    </div>
                    
                    <button
                        onClick={handleRetryPermissions}
                        style={{
                            marginTop: "15px",
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Try Again
                    </button>
                </div>
            )}

            <iframe
                src="https://rushimane2003-irrigation-trial.hf.space"
                title="Water Requirement Prediction"
                style={{ 
                    width: "100%", 
                    height: "100%", 
                    border: "none",
                    filter: (cameraError || locationError) ? "blur(4px)" : "none"
                }}
                onLoad={handleIframeLoad}
                allow="camera; geolocation"
            />
        </div>
    );
};

export default WaterRequirement;
