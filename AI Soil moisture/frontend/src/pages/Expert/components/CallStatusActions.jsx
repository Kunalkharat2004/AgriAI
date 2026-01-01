import React, { useState } from "react";
import {
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Phone, PhoneDisabled } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointmentCallStatus } from "../../../http/api";
import { toast } from "react-toastify";
import JitsiVideoCall from "./JitsiVideoCall";

const CallStatusActions = ({ appointment }) => {
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: updateCallStatus, isLoading } = useMutation({
    mutationFn: updateAppointmentCallStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["appointments"]);
      toast.success("Call status updated successfully");
      if (data.data.appointment.callStatus === "expert_accepted") {
        setShowVideoCall(true);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update call status");
    },
  });

  const handleStartCall = () => {
    if (!appointment.roomName) {
      // Generate room name if not exists
      const roomName = `agri-call-${appointment._id}-${Date.now()}`;
      updateCallStatus({
        appointmentId: appointment._id,
        callStatus: "expert_accepted",
        roomName: roomName,
      });
    } else {
      updateCallStatus({
        appointmentId: appointment._id,
        callStatus: "expert_accepted",
      });
    }
  };

  const handleEndCall = () => {
    updateCallStatus({
      appointmentId: appointment._id,
      callStatus: "call_ended",
    });
    setShowVideoCall(false);
  };

  const getCallStatusChip = () => {
    const status = appointment.callStatus || "not_requested";
    const statusConfig = {
      not_requested: { label: "No Call", color: "default" },
      farmer_requested: { label: "Call Requested", color: "warning" },
      expert_accepted: { label: "Call Accepted", color: "primary" },
      call_in_progress: { label: "In Call", color: "success" },
      call_ended: { label: "Call Ended", color: "default" },
    };

    const config = statusConfig[status] || statusConfig.not_requested;
    return (
      <Chip
        label={config.label}
        size="small"
        color={config.color}
        variant="outlined"
      />
    );
  };

  const getActionButton = () => {
    const status = appointment.callStatus || "not_requested";

    switch (status) {
      case "not_requested":
        return (
          <Button size="small" variant="outlined" disabled>
            Details
          </Button>
        );

      case "farmer_requested":
        return (
          <Box className="flex gap-1.5">
            <Button
              size="small"
              variant="outlined"
              onClick={() => setShowCallDialog(true)}
            >
              Details
            </Button>
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<Phone />}
              onClick={handleStartCall}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={16} /> : "Start Call"}
            </Button>
          </Box>
        );

      case "expert_accepted":
      case "call_in_progress":
        return (
          <Box className="flex gap-1.5">
            <Button
              size="small"
              variant="outlined"
              onClick={() => setShowCallDialog(true)}
            >
              Details
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<Phone />}
              onClick={() => setShowVideoCall(true)}
            >
              Join Call
            </Button>
          </Box>
        );

      case "call_ended":
        return (
          <Box className="flex gap-1.5">
            <Button
              size="small"
              variant="outlined"
              onClick={() => setShowCallDialog(true)}
            >
              Details
            </Button>
            <Button size="small" variant="contained" disabled>
              Call Ended
            </Button>
          </Box>
        );

      default:
        return (
          <Button size="small" variant="outlined" disabled>
            Details
          </Button>
        );
    }
  };

  return (
    <>
      <Box className="flex flex-col gap-1.5">
        {getCallStatusChip()}
        {getActionButton()}
      </Box>

      {/* Call Details Dialog */}
      <Dialog
        open={showCallDialog}
        onClose={() => setShowCallDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogContent>
          <Box className="space-y-3">
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Farmer Name
              </Typography>
              <Typography variant="body1">{appointment.farmerName}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Issue
              </Typography>
              <Typography variant="body1">{appointment.issue}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Crops
              </Typography>
              <Box className="flex flex-wrap gap-1 mt-1">
                {appointment.crops?.map((crop) => (
                  <Chip key={crop} label={crop} size="small" />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Location
              </Typography>
              <Typography variant="body1">
                {appointment.location || "Not specified"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Languages
              </Typography>
              <Box className="flex flex-wrap gap-1 mt-1">
                {appointment.languages?.map((lang) => (
                  <Chip
                    key={lang}
                    label={lang}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Preferred Time
              </Typography>
              <Typography variant="body1">
                {appointment.preferredTime || "Not specified"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Call Status
              </Typography>
              <Box className="mt-1">{getCallStatusChip()}</Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCallDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Video Call Component */}
      {showVideoCall && (
        <JitsiVideoCall
          open={showVideoCall}
          onClose={handleEndCall}
          roomName={appointment.roomName}
          displayName={`Expert - ${appointment.farmerName}`}
          onCallEnd={handleEndCall}
        />
      )}
    </>
  );
};

export default CallStatusActions;
