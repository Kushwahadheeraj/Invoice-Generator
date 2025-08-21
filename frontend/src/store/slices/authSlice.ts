import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService, LoginCredentials, RegisterCredentials, AuthResponse } from '../../services'

interface AuthState {
  token: string | null
  user: {
    id: string
    name: string
    email: string
  } | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: (() => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Failed to parse user data from localStorage:', error);
      localStorage.removeItem('user'); // Clean up invalid data
      return null;
    }
  })(),
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginCredentials): Promise<AuthResponse> => {
    return await authService.login(payload)
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterCredentials): Promise<void> => {
    await authService.register(payload)
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      authService.logout()
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
        state.token = action.payload.token
        state.user = action.payload.user
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
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


