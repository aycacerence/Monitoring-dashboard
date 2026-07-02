import { createSlice } from '@reduxjs/toolkit';

const savedRole = localStorage.getItem('userRole') || 'admin';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    role: savedRole,  // 'admin' | 'user'
  },
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
