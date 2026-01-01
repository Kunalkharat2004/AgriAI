import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Chip,
  Box,
} from "@mui/material";

import useTokenStore from "../../../store/useTokenStore";

const PreCallFormDialog = ({ open, onClose, expert, onProceed }) => {
  const { userId, userName: farmerName } = useTokenStore((s) => s);
  const [crops, setCrops] = useState("");
  const [issue, setIssue] = useState("");
  const [location, setLocation] = useState("");
  const [languages, setLanguages] = useState("");

  const handleProceed = () => {
    if (!farmerName || !issue) return;
    const payload = {
      farmerName,
      farmerUserId: userId || undefined,
      expertUserId: expert?.id,
      crops: crops
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      issue,
      location,
      languages: languages
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
    };
    onProceed && onProceed(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <div className="flex flex-col gap-1">
          <Typography variant="h6">Share your issue details</Typography>
          <Typography variant="body2" color="text.secondary">
            Expert: {expert?.name}
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent className="space-y-4">
        <TextField
          label="Your name"
          value={farmerName}
          fullWidth
          required
          disabled
        />
        <TextField
          label="Crops (comma separated)"
          value={crops}
          onChange={(e) => setCrops(e.target.value)}
          fullWidth
        />
        <TextField
          label="Describe your issue"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          required
        />
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
          />
          <TextField
            label="Languages (comma separated)"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            fullWidth
          />
        </Box>
        <div className="rounded-md bg-amber-50 p-3 text-amber-800 border border-amber-200">
          <Typography variant="body2">
            These details help the expert prepare before the call.
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleProceed}
          disabled={!farmerName || !issue}
        >
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreCallFormDialog;
