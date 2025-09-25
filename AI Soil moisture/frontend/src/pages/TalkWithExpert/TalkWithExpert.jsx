import { useMemo, useState } from "react";
import {
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import ExpertsTable from "./components/ExpertsTable";
import ScheduleMeetDialog from "./components/ScheduleMeetDialog";
import { useQuery } from "@tanstack/react-query";
import { getExperts } from "../../http/api";

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["experts"],
    queryFn: getExperts,
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
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleStartInstant = (expert) => {
    // Placeholder: integrate Jitsi here later
    console.log("Start instant meet with", expert?.name);
    setDialogOpen(false);
  };

  const handleSchedule = ({ expert, dateTime, duration }) => {
    // Placeholder: persist schedule to backend later
    console.log("Schedule meet", { expert: expert?.name, dateTime, duration });
    setDialogOpen(false);
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

      <ScheduleMeetDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        expert={selectedExpert}
        onStartInstant={handleStartInstant}
        onSchedule={handleSchedule}
      />
    </div>
  );
};

export default TalkWithExpert;
