// Cihaz tablosu verisini, arama terimini ve sayfalama durumunu yonetir.
import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
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

export const selectDevicesData = (state) => state.devices.data;
export const selectSearchTerm = (state) => state.devices.searchTerm;
export const selectCurrentPage = (state) => state.devices.currentPage;
export const selectItemsPerPage = (state) => state.devices.itemsPerPage;

export const selectFilteredDevices = createSelector(
  [selectDevicesData, selectSearchTerm],
  (data, searchTerm) => {
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
  }
);

export const selectPaginatedDevices = createSelector(
  [selectFilteredDevices, selectCurrentPage, selectItemsPerPage],
  (filteredDevices, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDevices.slice(startIndex, startIndex + itemsPerPage);
  }
);

export const selectDevicesPagination = createSelector(
  [selectFilteredDevices, selectCurrentPage, selectItemsPerPage],
  (filteredDevices, currentPage, itemsPerPage) => {
    return {
      currentPage,
      itemsPerPage,
      totalItems: filteredDevices.length,
      totalPages: Math.ceil(filteredDevices.length / itemsPerPage),
    };
  }
);

export default devicesSlice.reducer;
