import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isDirty: false,
    isEditMode: false,
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
  },
});

export const { setIsDirty, setEditMode, toggleEditMode } = uiSlice.actions;
export const selectIsEditMode = (state) => state.ui.isEditMode;
export const selectIsDirty = (state) => state.ui.isDirty;
export default uiSlice.reducer;
