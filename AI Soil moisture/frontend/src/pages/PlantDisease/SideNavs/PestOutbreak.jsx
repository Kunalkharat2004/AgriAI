import { useState, useEffect } from "react";

const PestOutbreak = () => {
    const [loading, setLoading] = useState(true);
    const [locationError, setLocationError] = useState(false);

    useEffect(() => {
        // Request location permission when component mounts
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocationError(false);
                },
                (error) => {
                    console.error("Location error:", error);
                    setLocationError(true);
                }
            );
        }
    }, []);

    const handleIframeLoad = () => {
        setLoading(false);
    };

    const handleRetryLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocationError(false);
                    // Reload iframe after getting permission
                    const iframe = document.querySelector('iframe');
                    if (iframe) {
                        iframe.src = iframe.src;
                    }
                },
                (error) => {
                    setLocationError(true);
                }
            );
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
                    <p>Please enable location access to use this feature.</p>
                    <button
                        onClick={handleRetryLocation}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Enable Location Access
                    </button>
                </div>
            )}
            <iframe
                src="https://rajkhanke007-pest-outbreak-prediction.hf.space/"
                title="Pest Outbreak Prediction"
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

export default PestOutbreak;