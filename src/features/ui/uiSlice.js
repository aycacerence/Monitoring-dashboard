import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isDirty: false,
  },
  reducers: {
    setIsDirty: (state, action) => {
      state.isDirty = action.payload;
    },
  },
});

export const { setIsDirty } = uiSlice.actions;
export default uiSlice.reducer;
