import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
} from "@mui/material";

const ScheduleMeetDialog = ({
  open,
  onClose,
  expert,
  onStartInstant,
  isWaitingForExpert = false,
}) => {
  const handleConfirm = () => {
    onStartInstant && onStartInstant();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <div className="flex flex-col gap-1">
          <Typography variant="h6">Start a call with {expert?.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            All calls are free for farmers
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent className="space-y-4">
        <div className="rounded-md bg-blue-50 p-3 text-blue-700 border border-blue-200">
          <Typography variant="body2">
            You will receive a Jitsi meeting link after confirmation. Share it
            only with trusted people.
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isWaitingForExpert}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={isWaitingForExpert}
          startIcon={
            isWaitingForExpert && <CircularProgress size={20} color="inherit" />
          }
        >
          {isWaitingForExpert ? "Waiting for expert..." : "Start now"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleMeetDialog;
