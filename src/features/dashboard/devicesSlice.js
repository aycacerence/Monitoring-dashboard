// Cihaz tablosu verisini, arama terimini ve sayfalama durumunu yonetir.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchDevicesData } from '../../data/fakeApi.js';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
  searchTerm: '',
  currentPage: 1,
  itemsPerPage: 10,
};

export const fetchDevices = createAsyncThunk('devices/fetchDevices', async () => {
  return fetchDevicesData();
});

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm, setCurrentPage, setItemsPerPage } = devicesSlice.actions;

export const selectFilteredDevices = (state) => {
  const { data, searchTerm } = state.devices;
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return data;
  }

  return data.filter((device) => {
    const searchableValues = [
      device.name,
      device.ipAddress,
      device.type,
      device.status,
    ];

    return searchableValues.some((value) =>
      value.toLowerCase().includes(normalizedSearchTerm),
    );
  });
};

export const selectPaginatedDevices = (state) => {
  const filteredDevices = selectFilteredDevices(state);
  const { currentPage, itemsPerPage } = state.devices;
  const startIndex = (currentPage - 1) * itemsPerPage;

  return filteredDevices.slice(startIndex, startIndex + itemsPerPage);
};

export const selectDevicesPagination = (state) => {
  const filteredDevices = selectFilteredDevices(state);
  const { currentPage, itemsPerPage } = state.devices;

  return {
    currentPage,
    itemsPerPage,
    totalItems: filteredDevices.length,
    totalPages: Math.ceil(filteredDevices.length / itemsPerPage),
  };
};

export default devicesSlice.reducer;
