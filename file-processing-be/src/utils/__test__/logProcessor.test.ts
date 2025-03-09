import fs from "fs";
import readline from "readline";
import { processLogFile } from "../../utils/logProcessor";
import { supabase } from "../../utils/supabase";

beforeEach(() => {
  jest.spyOn(fs.promises, "unlink").mockResolvedValue(undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

jest.mock("fs", () => {
  const logContentMock = `[2025-02-26T19:39:40.746Z] ERROR server-crash {"userId": 64, "ip": "192.168.58.206"}\n
    [2025-02-24T08:18:02.796Z] INFO database {"userId": 223, "ip": "192.168.145.49"}\n
    [2025-02-27T20:53:20.766Z] INFO timeout {"userId": 387, "ip": "192.168.207.137"}\n
    [2025-02-24T08:39:36.863Z] ERROR database {"userId": 361, "ip": "192.168.112.146"}\n
    [2025-03-04T06:36:11.463Z] WARN failed {"userId": 24, "ip": "192.168.59.125"}`;

  return {
    ...jest.requireActual("fs"),
    readFileSync: jest.fn().mockReturnValue(Buffer.from(logContentMock)),
    promises: {
      unlink: jest.fn(),
    },
  };
});
jest.mock("readline", () => ({
  createInterface: jest.fn().mockReturnValue({
    [Symbol.asyncIterator]: jest.fn(async function* () {
      yield "ERROR occurred here";
      yield "WARN detected";
    }),
  }),
}));
jest.mock("../../constants/config", () => ({
  config: {
    trackingKeys: ["ERROR", "WARN"],
    trackingIps: ["192.168.1.1"],
  },
}));
jest.mock("../../utils/supabase", () => ({
  supabase: {
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn().mockResolvedValue({ error: null }),
    },
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

describe("processLogFile", () => {
  const filePath = "/test/path.log";
  const fileId = "123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should process a log file and insert stats into Supabase", async () => {
    (readline.createInterface as jest.Mock).mockReturnValue({
      [Symbol.asyncIterator]: async function* () {
        yield "ERROR occurred here";
        yield "WARN detected";
        yield "INFO message";
        yield "192.168.1.1 failed login";
      },
    });

    // Mock database insert
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    // Mock file deletion
    (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);

    const result = await processLogFile(filePath, fileId);

    expect(result).toEqual({
      log_stats: {
        ERROR: 1,
        WARN: 1,
        "192.168.1.1": 1,
      },
      file_id: "123",
    });

    expect(supabase.from).toHaveBeenCalledWith("log_stats");
    expect(fs.promises.unlink).toHaveBeenCalledWith(filePath);
  });

  it("should log an error if database insert fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    (readline.createInterface as jest.Mock).mockReturnValue({
      [Symbol.asyncIterator]: async function* () {
        yield "ERROR something happened";
      },
    });

    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest
        .fn()
        .mockResolvedValue({ error: { message: "DB insert failed" } }),
    });

    const result = await processLogFile(filePath, fileId);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error inserting logs:", {
      message: "DB insert failed",
    });
    expect(result).toBeNull();
    consoleErrorSpy.mockRestore();
  });
});
