import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isDirty: false,
    isEditMode: false,
    selectedKpiIds: [],
  },
  reducers: {
    setIsDirty: (state, action) => {
      state.isDirty = action.payload;
    },
    setEditMode: (state, action) => {
      state.isEditMode = action.payload;
    },
    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode;
    },
    setSelectedKpiIds: (state, action) => {
      state.selectedKpiIds = action.payload;
    },
    toggleKpiSelection: (state, action) => {
      const id = action.payload;
      const index = state.selectedKpiIds.indexOf(id);
      if (index !== -1) {
        state.selectedKpiIds.splice(index, 1);
      } else {
        state.selectedKpiIds.push(id);
      }
    },
  },
});

export const { setIsDirty, setEditMode, toggleEditMode, setSelectedKpiIds, toggleKpiSelection } = uiSlice.actions;
export const selectIsEditMode = (state) => state.ui.isEditMode;
export const selectIsDirty = (state) => state.ui.isDirty;
export const selectSelectedKpiIds = (state) => state.ui.selectedKpiIds;
export default uiSlice.reducer;
