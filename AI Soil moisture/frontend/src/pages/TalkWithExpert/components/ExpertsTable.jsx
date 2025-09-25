import {
  Avatar,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

const ExpertsTable = ({ experts = [], onCall }) => {
  return (
    <TableContainer component={Paper} className="shadow-md">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2" className="font-semibold">
                Expert
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" className="font-semibold">
                Specialization
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" className="font-semibold">
                Experience
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" className="font-semibold">
                Languages
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" className="font-semibold">
                Rating
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2" className="font-semibold">
                Action
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {experts.map((expert) => (
            <TableRow key={expert.id} hover>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar src={expert.photoUrl} alt={expert.name} />
                  <div>
                    <Typography variant="subtitle1" className="font-medium">
                      {expert.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {expert.location}
                    </Typography>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Typography variant="body2">
                    {expert.specialization}
                  </Typography>
                  {expert.availability && (
                    <Tooltip title="General availability windows">
                      <Chip
                        size="small"
                        color="success"
                        variant="outlined"
                        label={expert.availability}
                      />
                    </Tooltip>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {expert.experienceYears}+ yrs
                </Typography>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {expert.languages.map((l) => (
                    <Chip key={l} size="small" label={l} />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {expert.rating.toFixed(1)} / 5
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onCall && onCall(expert)}
                >
                  Call
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExpertsTable;
