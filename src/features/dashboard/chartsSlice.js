// Dashboard grafiklerinde kullanilan CPU, ag trafigi ve cihaz durum dagilimi verilerini yonetir.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchChartsData } from '../../data/fakeApi.js';

const initialState = {
  data: {
    cpuUsage: [],
    networkTraffic: [],
    deviceStatusDistribution: [],
  },
  status: 'idle',
  error: null,
};

export const fetchCharts = createAsyncThunk('charts/fetchCharts', async () => {
  return fetchChartsData();
});

const chartsSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCharts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchCharts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default chartsSlice.reducer;
