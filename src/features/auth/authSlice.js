import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: () => ({
    role: localStorage.getItem('userRole') || 'admin',  // 'admin' | 'user'
  }),
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem('userRole', action.payload);
    },
  },
});

export const { setRole } = authSlice.actions;
export const selectRole = (state) => state.auth.role;
export default authSlice.reducer;
