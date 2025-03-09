import request from "supertest";
import { jest } from "@jest/globals";
import { logQueue } from "../utils/queue";
import { app } from "../../server";

jest.mock("../constants/config", () => ({
  config: {
    supabaseUrl: "http://mocked-supabase-url",
    supabaseKey: "mocked-supabase-key",
    bullMQQueue: "mocked_queue_name"
  },
}));

import { supabase } from "../utils/supabase";

jest.mock("../middlewares/authMiddleware", () => ({
  authenticate: (_req: any, _res: any, next: any) => next(), // Mock authentication
}));

jest.mock('bullmq', () => {
    return {
      Queue: jest.fn().mockImplementation(() => ({
        add: jest.fn(),
      })),
    };
  });

describe("POST /api/upload-logs", () => {
  it("should return 400 if no file is uploaded", async () => {
    const response = await request(app).post("/api/upload-logs");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "No file uploaded" });
  });

  it("should return jobId when file is uploaded", async () => {
    const response = await request(app)
      .post("/api/upload-logs")
      .attach("file", Buffer.from("dummy file content"), {
        filename: "test.log",
        contentType: "text/plain",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("jobId", "1");
    expect(logQueue.add).toHaveBeenCalledWith(
      "process-log",
      expect.any(Object)
    );
  });
});
