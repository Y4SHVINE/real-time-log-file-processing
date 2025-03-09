import api from "@/lib/axios";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useState } from "react";

const LogUpload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload-logs", formData);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 2 }}>
      <Box sx={{ my: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Upload Your Log File</Typography>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file}
          sx={{width: "100px"}}
        >
          Upload
        </Button>
      </Box>
    </Paper>
  );
};

export default LogUpload;
