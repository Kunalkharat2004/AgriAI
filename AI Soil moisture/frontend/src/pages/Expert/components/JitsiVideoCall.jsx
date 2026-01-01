import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";

const JitsiVideoCall = ({
  open,
  onClose,
  roomName,
  displayName,
  onCallEnd,
}) => {
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (open && roomName) {
      initializeJitsi();
    }

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [open, roomName]);

  const initializeJitsi = () => {
    setIsLoading(true);

    // Load Jitsi Meet API script if not already loaded
    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = () => {
        startJitsiCall();
      };
      script.onerror = () => {
        console.error("Failed to load Jitsi Meet API");
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      startJitsiCall();
    }
  };

  const startJitsiCall = () => {
    try {
      const domain = "meet.jit.si"; // Using public Jitsi instance

      const options = {
        roomName: roomName,
        width: "100%",
        height: "100%",
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: displayName || "User",
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          enableClosePage: false,
          disableModeratorIndicator: false,
          startScreenSharing: false,
          enableEmailInStats: false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "closedcaptions",
            "desktop",
            "fullscreen",
            "fodeviceselection",
            "hangup",
            "profile",
            "chat",
            "recording",
            "livestreaming",
            "etherpad",
            "sharedvideo",
            "settings",
            "raisehand",
            "videoquality",
            "filmstrip",
            "invite",
            "feedback",
            "stats",
            "shortcuts",
            "tileview",
            "videobackgroundblur",
            "download",
            "help",
            "mute-everyone",
            "e2ee",
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
        },
      };

      jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      // Event listeners
      jitsiApiRef.current.addListener("videoConferenceJoined", () => {
        console.log("Joined video conference");
        setIsLoading(false);
      });

      jitsiApiRef.current.addListener("videoConferenceLeft", () => {
        console.log("Left video conference");
        onCallEnd && onCallEnd();
      });

      jitsiApiRef.current.addListener("participantJoined", (participant) => {
        console.log("Participant joined:", participant);
      });

      jitsiApiRef.current.addListener("participantLeft", (participant) => {
        console.log("Participant left:", participant);
      });

      jitsiApiRef.current.addListener("readyToClose", () => {
        onClose && onClose();
      });
    } catch (error) {
      console.error("Error initializing Jitsi:", error);
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("toggleAudio");
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("toggleVideo");
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("hangup");
    }
    onClose && onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      maxWidth={false}
      PaperProps={{
        style: {
          backgroundColor: "#000",
          color: "#fff",
        },
      }}
    >
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#000",
          color: "#fff",
          padding: "16px 24px",
        }}
      >
        <Typography variant="h6" style={{ color: "#fff" }}>
          Video Call - {roomName}
        </Typography>
        <IconButton onClick={endCall} style={{ color: "#fff" }} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        style={{
          padding: 0,
          backgroundColor: "#000",
          position: "relative",
          height: "calc(100vh - 80px)",
        }}
      >
        {isLoading && (
          <Box
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <CircularProgress style={{ color: "#fff" }} />
            <Typography variant="body1" style={{ color: "#fff" }}>
              Connecting to video call...
            </Typography>
          </Box>
        )}

        <div
          ref={jitsiContainerRef}
          style={{
            width: "100%",
            height: "100%",
            minHeight: "500px",
          }}
        />

        {/* Custom controls overlay */}
        <Box
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "16px",
            zIndex: 1000,
          }}
        >
          <Button
            variant="contained"
            onClick={toggleMute}
            style={{
              backgroundColor: isMuted ? "#f44336" : "#4caf50",
              color: "#fff",
              minWidth: "56px",
              height: "56px",
              borderRadius: "50%",
            }}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </Button>

          <Button
            variant="contained"
            onClick={toggleVideo}
            style={{
              backgroundColor: isVideoOff ? "#f44336" : "#4caf50",
              color: "#fff",
              minWidth: "56px",
              height: "56px",
              borderRadius: "50%",
            }}
          >
            {isVideoOff ? <VideocamOff /> : <Videocam />}
          </Button>

          <Button
            variant="contained"
            onClick={endCall}
            style={{
              backgroundColor: "#f44336",
              color: "#fff",
              minWidth: "56px",
              height: "56px",
              borderRadius: "50%",
            }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default JitsiVideoCall;
