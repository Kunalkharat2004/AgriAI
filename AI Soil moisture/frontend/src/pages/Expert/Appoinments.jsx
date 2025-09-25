import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Avatar,
  Button,
  Chip,
  Typography,
  Grid,
  Box,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const hardcodedAppointments = [
  {
    id: "apt-1",
    farmerName: "Ramesh Patil",
    crops: ["Cotton", "Soybean"],
    issue: "Leaf yellowing and stunted growth",
    preferredTime: "Today, 4:30 PM",
    location: "Nashik, Maharashtra",
    languages: ["Marathi", "Hindi"],
    photoUrl: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: "apt-2",
    farmerName: "Sita Devi",
    crops: ["Wheat"],
    issue: "Soil moisture irregularity",
    preferredTime: "Tomorrow, 11:00 AM",
    location: "Jaipur, Rajasthan",
    languages: ["Hindi"],
    photoUrl: "https://i.pravatar.cc/100?img=22",
  },
  {
    id: "apt-3",
    farmerName: "Harpreet Singh",
    crops: ["Rice", "Mustard"],
    issue: "Pest infestation (brown planthopper)",
    preferredTime: "Fri, 2:00 PM",
    location: "Amritsar, Punjab",
    languages: ["Punjabi", "Hindi"],
    photoUrl: "https://i.pravatar.cc/100?img=32",
  },
];

const Appoinments = () => {
  const appointments = useMemo(() => hardcodedAppointments, []);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return appointments;
    return appointments.filter((a) => {
      return (
        a.farmerName.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.issue.toLowerCase().includes(q) ||
        a.crops.join(" ").toLowerCase().includes(q) ||
        a.languages.join(" ").toLowerCase().includes(q)
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
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((apt) => (
              <TableRow key={apt.id} hover>
                <TableCell>
                  <Box className="flex items-center gap-2">
                    <Avatar src={apt.photoUrl} alt={apt.farmerName} />
                    <Box>
                      <Typography variant="subtitle2" className="font-medium">
                        {apt.farmerName}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box className="flex flex-wrap gap-1.5">
                    {apt.crops.map((c) => (
                      <Chip key={c} label={c} size="small" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell sx={{ maxWidth: 280 }}>
                  <Typography variant="body2" noWrap title={apt.issue}>
                    {apt.issue}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{apt.preferredTime}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{apt.location}</Typography>
                </TableCell>
                <TableCell>
                  <Box className="flex flex-wrap gap-1.5">
                    {apt.languages.map((l) => (
                      <Chip key={l} label={l} size="small" variant="outlined" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box className="flex justify-end gap-1.5">
                    <Button size="small" variant="outlined">
                      Details
                    </Button>
                    <Button size="small" variant="contained">
                      Start call
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Appoinments;
