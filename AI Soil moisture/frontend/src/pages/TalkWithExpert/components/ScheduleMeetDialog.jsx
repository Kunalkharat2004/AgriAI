import React, { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

const ScheduleMeetDialog = ({
  open,
  onClose,
  expert,
  onStartInstant,
  onSchedule,
}) => {
  const [mode, setMode] = useState("instant");
  const [dateTime, setDateTime] = useState("");
  const [duration, setDuration] = useState(15);

  const disabledSchedule = useMemo(
    () => mode === "schedule" && !dateTime,
    [mode, dateTime]
  );

  const handleConfirm = () => {
    if (mode === "instant") {
      onStartInstant && onStartInstant(expert);
    } else {
      onSchedule && onSchedule({ expert, dateTime, duration });
    }
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
        <ToggleButtonGroup
          color="primary"
          value={mode}
          exclusive
          onChange={(_, val) => val && setMode(val)}
          className="flex"
        >
          <ToggleButton value="instant" className="flex-1">
            Instant meet
          </ToggleButton>
          <ToggleButton value="schedule" className="flex-1">
            Schedule
          </ToggleButton>
        </ToggleButtonGroup>

        {mode === "schedule" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              type="datetime-local"
              label="Date & time"
              InputLabelProps={{ shrink: true }}
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="duration-label">Duration</InputLabel>
              <Select
                labelId="duration-label"
                label="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                {[15, 30, 45, 60].map((m) => (
                  <MenuItem key={m} value={m}>
                    {m} min
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        <div className="rounded-md bg-blue-50 p-3 text-blue-700 border border-blue-200">
          <Typography variant="body2">
            You will receive a Jitsi meeting link after confirmation. Share it
            only with trusted people.
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={disabledSchedule}
        >
          {mode === "instant" ? "Start now" : "Schedule meet"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleMeetDialog;
