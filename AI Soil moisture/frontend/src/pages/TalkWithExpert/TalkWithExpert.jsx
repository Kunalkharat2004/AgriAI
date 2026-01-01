import { useEffect, useMemo, useState } from "react";
import {
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import JitsiVideoCall from "../Expert/components/JitsiVideoCall";
import ExpertsTable from "./components/ExpertsTable";
import ScheduleMeetDialog from "./components/ScheduleMeetDialog";
import PreCallFormDialog from "./components/PreCallFormDialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAppointmentApi,
  getExperts,
  updateAppointmentCallStatus,
} from "../../http/api";
import { toast } from "react-toastify";

const transformExpert = (e) => ({
  id: e.id,
  name: e.name,
  specialization: e.specialization || "",
  experienceYears: e.experienceYears || 0,
  languages: e.languages || [],
  rating: e.rating || 4.8,
  location: e.location || "",
  availability: e.availability || "",
  photoUrl: e.photoUrl || "",
});

const TalkWithExpert = () => {
  const [query, setQuery] = useState("");
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [preFormOpen, setPreFormOpen] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [isWaitingForExpert, setIsWaitingForExpert] = useState(false);
  const [callRoomName, setCallRoomName] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    // Listen for call accepted event from socket
    const handleCallAccepted = (data) => {
      console.log("Received call accepted event:", data);

      if (data) {
        setIsWaitingForExpert(false);
        setDialogOpen(false);
        setCallRoomName(data.roomName);
        setIsCallActive(true);
        toast.success("Expert accepted the call! Joining video call...");
      }
    };

    console.log(
      "Setting up socket listener, socket status:",
      window.socket?.connected
    );

    if (window.socket) {
      // Remove any existing listeners to prevent duplicates
      window.socket.off("appointment_call_accepted");

      // Add the new listener
      window.socket.on("appointment_call_accepted", handleCallAccepted);

      // Join the user orders room for receiving call events
      if (window.user?._id) {
        console.log("Joining user orders room:", window.user._id);
        window.socket.emit("join_user_orders", window.user._id);
      }
    }

    // Cleanup
    return () => {
      if (window.socket) {
        console.log("Cleaning up socket listener");
        window.socket.off("appointment_call_accepted", handleCallAccepted);
      }
    };
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["experts"],
    queryFn: getExperts,
  });

  const { mutate: createAppointment } = useMutation({
    mutationFn: createAppointmentApi,
    onSuccess: (data) => {
      setAppointmentId(data.data.appointment._id);
      toast.success("Appointment created successfully", {
        autoClose: 4000,
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        autoClose: 4000,
      });
    },
  });

  const { mutate: requestCall } = useMutation({
    mutationFn: updateAppointmentCallStatus,
    onSuccess: () => {
      toast.success("Connecting to expert, please wait...", {
        autoClose: 6000,
      });
      // Note: We don't close the dialog here anymore since we're waiting for expert response
    },
    onError: (error) => {
      toast.error(error.message || "Failed to request call", {
        autoClose: 4000,
      });
      setIsWaitingForExpert(false);
      setDialogOpen(false);
    },
  });

  const experts = useMemo(() => {
    const list = data?.experts || [];
    return list.map(transformExpert);
  }, [data]);

  const filteredExperts = useMemo(() => {
    if (!query) return experts;
    const q = query.toLowerCase();
    return experts.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.specialization.toLowerCase().includes(q) ||
        e.languages.join(" ").toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
    );
  }, [experts, query]);

  const handleCallClick = (expert) => {
    setSelectedExpert(expert);
    setPreFormOpen(true);
  };

  const handleCloseDialog = () => {
    if (!isWaitingForExpert) {
      setDialogOpen(false);
      setIsWaitingForExpert(false);
    }
  };

  const handleClosePreForm = () => {
    setPreFormOpen(false);
    setAppointmentId(null);
  };

  const handlePreFormProceed = (data) => {
    const payload = { ...data };
    createAppointment(payload);
    setPreFormOpen(false);
    
    // Open Jitsi Meet room in a new tab
    window.open('https://meet.jit.si/Room6312', '_blank');
  };

  const handleStartInstant = () => {
    if (!appointmentId) {
      toast.error("Appointment not created yet. Please try again.");
      setDialogOpen(false);
      return;
    }

    // Reset any existing call state
    setIsCallActive(false);
    setCallRoomName(null);

    // Generate room name for the call
    const roomName = `agri-call-${appointmentId}-${Date.now()}`;
    console.log("Generated room name:", roomName);

    setCallRoomName(roomName);
    setIsWaitingForExpert(true);

    // Ensure socket is connected and joined to the correct room
    if (window.socket && window.user?._id) {
      window.socket.emit("join_user_orders", window.user._id);
    }

    // Request call with the expert
    requestCall({
      appointmentId: appointmentId,
      callStatus: "farmer_requested",
      roomName: roomName,
    });

    // Set a timeout for expert response
    const timeoutId = setTimeout(() => {
      if (isWaitingForExpert) {
        setIsWaitingForExpert(false);
        setCallRoomName(null);
        setDialogOpen(false);
        toast.error(
          "Sorry, the expert didn't receive the call. Please try again later."
        );
      }
    }, 20000); // 20 seconds

    return () => clearTimeout(timeoutId);
  };

  const handleCallEnd = () => {
    setIsCallActive(false);
    setCallRoomName(null);
    if (appointmentId) {
      requestCall({
        appointmentId: appointmentId,
        callStatus: "call_ended",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <Typography variant="h5" className="font-semibold">
            Talk with Experts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect with specialized agriculture experts via free video calls.
          </Typography>
        </div>
        <div className="w-full md:w-80">
          <TextField
            fullWidth
            placeholder="Search experts by name, skill, language, location"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <Paper className="p-4 min-h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <CircularProgress />
          </div>
        ) : isError ? (
          <Alert severity="error">Failed to load experts.</Alert>
        ) : (
          <ExpertsTable experts={filteredExperts} onCall={handleCallClick} />
        )}
      </Paper>

      <PreCallFormDialog
        open={preFormOpen}
        onClose={handleClosePreForm}
        expert={selectedExpert}
        onProceed={handlePreFormProceed}
      />

      <ScheduleMeetDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        expert={selectedExpert}
        onStartInstant={handleStartInstant}
        isWaitingForExpert={isWaitingForExpert}
      />

      {isCallActive && callRoomName && (
        <JitsiVideoCall
          key={callRoomName} // Add key to force remount when room changes
          open={true}
          onClose={handleCallEnd}
          roomName={callRoomName}
          displayName={window.user?.name || "Farmer"}
          onCallEnd={handleCallEnd}
        />
      )}

      {/* Debug info - remove in production */}
      <div style={{ display: "none" }}>
        <p>Debug Info:</p>
        <p>Call Active: {String(isCallActive)}</p>
        <p>Room Name: {callRoomName}</p>
        <p>Waiting: {String(isWaitingForExpert)}</p>
        <p>Socket Connected: {String(window.socket?.connected)}</p>
      </div>
    </div>
  );
};

export default TalkWithExpert;
