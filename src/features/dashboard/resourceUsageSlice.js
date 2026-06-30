// CPU, bellek ve disk kullanim kartlarinda kullanilan kaynak metriklerini yonetir.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchResourceUsageData } from '../../data/fakeApi.js';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchResourceUsage = createAsyncThunk('resourceUsage/fetchResourceUsage', async () => {
  return fetchResourceUsageData();
});

const resourceUsageSlice = createSlice({
  name: 'resourceUsage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResourceUsage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchResourceUsage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchResourceUsage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default resourceUsageSlice.reducer;
