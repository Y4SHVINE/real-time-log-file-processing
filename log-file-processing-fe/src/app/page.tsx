"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import supabase from "@/lib/supabase";
import { config } from "@/utils/config";
import {
  Container,
  Paper,
  Typography,
} from "@mui/material";
import LogUpload from "./components/logsUpload";
import LogStatsTable from "./components/logsStatsTable";
import { addStat } from "@/lib/store/statsSlice";

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) router.push("/auth");
    };
    checkUser();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(config.webSocketUrl);

    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onerror = (error) => console.log("WebSocket Error:", error);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        dispatch(addStat(data));
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };

    ws.onclose = () => console.log("WebSocket connection closed");

    return () => ws.close();
  }, []);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Log Stats Dashboard
        </Typography>
        <LogUpload />
        <LogStatsTable />
      </Paper>
    </Container>
  );
}

export default Dashboard;