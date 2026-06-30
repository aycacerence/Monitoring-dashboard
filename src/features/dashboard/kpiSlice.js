// src/features/dashboard/kpiSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchKpiData } from '../../data/fakeApi.js';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

// Async Thunk tanımlaması
export const fetchKpis = createAsyncThunk('kpi/fetchKpis', async () => {
  const data = await fetchKpiData();
  return data;
});

const kpiSlice = createSlice({
  name: 'kpi',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKpis.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchKpis.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchKpis.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});


export default kpiSlice.reducer;