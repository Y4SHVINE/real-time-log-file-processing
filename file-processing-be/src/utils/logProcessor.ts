import { config } from "../constants/config";
import fs from "fs";
import readline from "readline";
import { supabase } from "./supabase";

const uploadFileToStorage = async (filePath:string, fileId: string) => {
    console.log("Uploading log file to supabase storage");
    const fileBuffer = fs.readFileSync(filePath);
    const { error } = await supabase.storage
      .from("log_files")
      .upload(`${fileId}.log`, fileBuffer, {
        contentType: "text/plain",
        upsert: true,
      });
  
    if (error) {
      console.error("Error uploading file to Supabase: ", error.message);
      return;
    }
  };

export const processLogFile = async (filePath:string, fileId: string) =>{
    const stream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    let errorCounts: Record<string, number> = {};
    const keys = [...config.trackingKeys, ...config.trackingIps];

    for await (const line of rl) {
      keys.forEach((key) => {
        if (!errorCounts[key]) errorCounts[key] = 0;
        if (line.includes(key)) {
          errorCounts[key]++;
        }
      });
    }

    const logStat = { log_stats: errorCounts, file_id: fileId };
    const { error } = await supabase.from("log_stats").insert(logStat);
    if (error) {
      console.error("Error inserting logs:", error);
      return null;
    } else {
      await uploadFileToStorage(filePath, fileId);
      await fs.promises.unlink(filePath);
      console.log(`File ${filePath} deleted successfully.`);
      return logStat;
    }
}