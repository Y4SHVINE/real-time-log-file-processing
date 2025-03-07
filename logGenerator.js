import fs from "fs";

const logFile = "sample.log";
const logSize = 10 * 1024 * 1024; // 10MB
const logLevels = ["INFO", "WARN", "ERROR"];
const keywords = ["database", "timeout", "failed", "user-login", "server-crash"];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomTimestamp = () => new Date(Date.now() - Math.random() * 1000000000).toISOString();

const writeStream = fs.createWriteStream(logFile);

let writtenBytes = 0;
while (writtenBytes < logSize) {
    const logEntry = `[${getRandomTimestamp()}] ${getRandomElement(logLevels)} ${getRandomElement(keywords)} {"userId": ${Math.floor(Math.random() * 1000)}, "ip": "192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}"}\n`;
    writtenBytes += Buffer.byteLength(logEntry);
    writeStream.write(logEntry);
}

writeStream.end(() => console.log("log file created:", logFile));
