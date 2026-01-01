import { useMemo, useState } from "react";
import {
  Avatar,
  Chip,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery } from "@tanstack/react-query";
import { getAppointmentsForExpert } from "../../http/api";
import useTokenStore from "../../store/useTokenStore";
import CallStatusActions from "./components/CallStatusActions";
import { useEffect } from "react";
import {
  initializeSocket,
  joinExpertRoom,
  onAppointmentEvent,
} from "../../services/socketService";
import { toast } from "react-toastify";

const Appoinments = () => {
  const { userId: expertId } = useTokenStore((state) => state);
  const [query, setQuery] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["appointments", expertId],
    queryFn: () => getAppointmentsForExpert(expertId),
    enabled: !!expertId,
  });

  // Initialize socket and listen for appointment notifications
  useEffect(() => {
    if (!expertId) return;

    // Initialize socket connection
    initializeSocket();

    // Join expert room
    joinExpertRoom(expertId);

    // Listen for appointment call requests
    const unsubscribeCallRequest = onAppointmentEvent(
      "appointment_call_requested",
      (data) => {
        toast.info(`New call request from ${data.farmerName}!`, {
          autoClose: 6000,
        });
        refetch(); // Refresh the appointments list
      }
    );

    // Listen for appointment call accepted
    const unsubscribeCallAccepted = onAppointmentEvent(
      "appointment_call_accepted",
      (data) => {
        toast.success(`Call accepted for ${data.farmerName}!`, {
          autoClose: 4000,
        });
        refetch();
      }
    );

    // Listen for appointment call ended
    const unsubscribeCallEnded = onAppointmentEvent(
      "appointment_call_ended",
      (data) => {
        toast.info(`Call ended with ${data.farmerName}`, {
          autoClose: 4000,
        });
        refetch();
      }
    );

    // Cleanup on unmount
    return () => {
      unsubscribeCallRequest();
      unsubscribeCallAccepted();
      unsubscribeCallEnded();
    };
  }, [expertId, refetch]);

  const appointments = useMemo(() => {
    return data?.appointments || [];
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return appointments;
    return appointments.filter((a) => {
      return (
        a.farmerName?.toLowerCase().includes(q) ||
        a.location?.toLowerCase().includes(q) ||
        a.issue?.toLowerCase().includes(q) ||
        a.crops?.join(" ").toLowerCase().includes(q) ||
        a.languages?.join(" ").toLowerCase().includes(q)
      );
    });
  }, [appointments, query]);

  return (
    <Box className="max-w-7xl mx-auto p-4 md:p-6">
      <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <Box>
          <Typography variant="h4" className="font-semibold">
            Appointments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review incoming requests and start a video call when ready.
          </Typography>
        </Box>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          placeholder="Search by farmer, crop, issue, location..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} className="shadow-sm">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Farmer</TableCell>
              <TableCell>Crops</TableCell>
              <TableCell>Issue</TableCell>
              <TableCell>Preferred time</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Languages</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box className="flex items-center justify-center py-8">
                    <CircularProgress />
                    <Typography variant="body2" className="ml-2">
                      Loading appointments...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Alert severity="error">
                    Failed to load appointments. Please try again.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {query
                      ? "No appointments found matching your search."
                      : "No appointments yet."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((apt) => (
                <TableRow key={apt._id} hover>
                  <TableCell>
                    <Box className="flex items-center gap-2">
                      <Avatar
                        src={`https://i.pravatar.cc/100?img=${
                          apt.farmerName?.charCodeAt(0) || 1
                        }`}
                        alt={apt.farmerName}
                      />
                      <Box>
                        <Typography variant="subtitle2" className="font-medium">
                          {apt.farmerName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex flex-wrap gap-1.5">
                      {apt.crops?.map((c) => (
                        <Chip key={c} label={c} size="small" />
                      )) || (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 280 }}>
                    <Typography variant="body2" noWrap title={apt.issue}>
                      {apt.issue}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {apt.preferredTime || "Not specified"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {apt.location || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box className="flex flex-wrap gap-1.5">
                      {apt.languages?.map((l) => (
                        <Chip
                          key={l}
                          label={l}
                          size="small"
                          variant="outlined"
                        />
                      )) || (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={apt.status || "pending"}
                      size="small"
                      color={
                        apt.status === "completed"
                          ? "success"
                          : apt.status === "scheduled"
                          ? "primary"
                          : apt.status === "cancelled"
                          ? "error"
                          : "default"
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <CallStatusActions appointment={apt} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Appoinments;
