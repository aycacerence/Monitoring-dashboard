// Sistem alarm listesini ve alarm veri yukleme durumunu yonetir.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAlertsData } from '../../data/fakeApi.js';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchAlerts = createAsyncThunk('alerts/fetchAlerts', async () => {
  return fetchAlertsData();
});

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default alertsSlice.reducer;
