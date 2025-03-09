import api from "@/lib/axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { setStats } from "@/lib/store/statsSlice";
import { RootState } from "@/lib/store/store";

const LogStatsTable = () => {
  const dispatch = useDispatch();
  const stats = useSelector((state: RootState) => state.stats.stats);
  
  useEffect(() => {
    getLogStats();
  }, []);

  const getLogStats = async () => {
    try {
      const res = await api.get("/stats");
      dispatch(setStats(res.data))
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>File ID</strong>
            </TableCell>
            <TableCell>
              <strong>Log Stats</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.length > 0 ? (
            stats.map((s) => (
              <TableRow key={s.id || s.file_id}>
                <TableCell>{s.file_id}</TableCell>
                <TableCell>
                  <Accordion>
                    <AccordionSummary expandIcon={">"}>
                      View Log Details
                    </AccordionSummary>
                    <AccordionDetails>
                      <pre>{JSON.stringify(s.log_stats, null, 2)}</pre>
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">
                No logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LogStatsTable;
