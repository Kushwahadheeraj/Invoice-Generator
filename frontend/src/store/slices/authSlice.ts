import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface AuthState {
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }) => {
    const res = await axios.post('http://localhost:5001/api/auth/login', payload)
    return res.data.token as string
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload: { name: string; email: string; password: string }) => {
    await axios.post('http://localhost:5001/api/auth/register', payload)
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload
        localStorage.setItem('token', action.payload)
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false
        state.error = action.error?.message || 'Login failed'
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(register.rejected, (state, action: any) => {
        state.loading = false
        state.error = action.error?.message || 'Registration failed'
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer


