// Sistem genel durum kartinda kullanilan ozet bilgileri yonetir.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSystemSummaryData } from '../../data/fakeApi.js';

const initialState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchSystemSummary = createAsyncThunk('systemSummary/fetchSystemSummary', async () => {
  return fetchSystemSummaryData();
});

const systemSummarySlice = createSlice({
  name: 'systemSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemSummary.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSystemSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchSystemSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default systemSummarySlice.reducer;
