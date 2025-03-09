import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LogStat {
  id: string;
  created_at: string;
  file_id: string;
  log_stats: any;
}

interface StatsState {
  stats: LogStat[];
}

const initialState: StatsState = {
  stats: [],
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<LogStat[]>) => {
      state.stats = action.payload;
    },
    addStat: (state, action: PayloadAction<LogStat>) => {
      state.stats = [...state.stats, action.payload];
    },
  },
});

export const { setStats, addStat } = statsSlice.actions;
const statsReducer = statsSlice.reducer;
export default statsReducer;
