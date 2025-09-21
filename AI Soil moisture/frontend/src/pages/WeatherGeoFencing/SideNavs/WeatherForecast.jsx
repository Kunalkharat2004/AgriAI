import { useState, useEffect } from "react";

const WeatherForecast = () => {
    const [loading, setLoading] = useState(true);
    const [locationError, setLocationError] = useState(false);
    const [locationStatus, setLocationStatus] = useState('');

    useEffect(() => {
        checkLocationPermission();
    }, []);

    const checkLocationPermission = () => {
        if ("geolocation" in navigator) {
            navigator.permissions.query({ name: 'geolocation' })
                .then((permissionStatus) => {
                    if (permissionStatus.state === 'granted') {
                        setLocationError(false);
                        setLocationStatus('granted');
                        getCurrentLocation();
                    } else if (permissionStatus.state === 'prompt') {
                        requestLocation();
                    } else {
                        setLocationError(true);
                        setLocationStatus('denied');
                    }
                });
        } else {
            setLocationError(true);
            setLocationStatus('unsupported');
        }
    };

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocationError(false);
                setLoading(false);
            },
            (error) => {
                console.error("Location error:", error);
                setLocationError(true);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    const requestLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocationError(false);
                setLocationStatus('granted');
                setLoading(false);
            },
            (error) => {
                console.error("Location error:", error);
                setLocationError(true);
                setLocationStatus('denied');
                setLoading(false);
            }
        );
    };

    const handleRetryLocation = () => {
        setLoading(true);
        checkLocationPermission();
        // Reload iframe after getting permission
        const iframe = document.querySelector('iframe');
        if (iframe) {
            iframe.src = iframe.src;
        }
    };

    const handleIframeLoad = () => {
        if (!locationError) {
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

            {locationError && (
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
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                    }}
                >
                    <h3>Location Access Required</h3>
                    <p>
                        {locationStatus === 'denied' 
                            ? "Location access is blocked. Please enable location access in your browser settings:"
                            : locationStatus === 'unsupported'
                            ? "Your browser doesn't support geolocation"
                            : "Please enable location access to use this feature"}
                    </p>
                    
                    {locationStatus === 'denied' && (
                        <div style={{ marginTop: "10px", fontSize: "14px", textAlign: "left" }}>
                            <p><strong>Chrome/Edge:</strong></p>
                            <ol>
                                <li>Click the lock/info icon in the address bar</li>
                                <li>Click "Site settings"</li>
                                <li>Find "Location" and change to "Allow"</li>
                            </ol>
                            <p><strong>Firefox:</strong></p>
                            <ol>
                                <li>Click the lock/info icon in the address bar</li>
                                <li>Click "Clear settings and try again"</li>
                                <li>Refresh the page</li>
                            </ol>
                        </div>
                    )}
                    
                    <button
                        onClick={handleRetryLocation}
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
                src="https://rajkhanke-weather-forecast-farmers.hf.space/"
                title="Weather Forecast"
                style={{ 
                    width: "100%", 
                    height: "100%", 
                    border: "none",
                    filter: locationError ? "blur(4px)" : "none"
                }}
                onLoad={handleIframeLoad}
                allow="geolocation"
            />
        </div>
    );
};

export default WeatherForecast;