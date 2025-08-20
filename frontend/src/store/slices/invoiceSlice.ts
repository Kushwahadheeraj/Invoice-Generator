import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'
import { Invoice } from '../../types'

const API = 'http://localhost:5001/api/invoices'

export const fetchInvoices = createAsyncThunk<Invoice[], string[] | undefined, { state: RootState }>(
  'invoices/fetch',
  async (filters, { getState }) => {
    const token = getState().auth.token
    const params = new URLSearchParams()
    if (filters && filters.length) params.append('status', filters.join(','))
    const res = await axios.get(`${API}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  }
)

export const createInvoice = createAsyncThunk<Invoice, any, { state: RootState }>(
  'invoices/create',
  async (payload, { getState }) => {
    const token = getState().auth.token
    const res = await axios.post(API, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  }
)

interface InvoicesState {
  list: Invoice[]
  loading: boolean
  error: string | null
}

const initialState: InvoicesState = {
  list: [],
  loading: false,
  error: null,
}

const slice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchInvoices.rejected, (state, action: any) => {
        state.loading = false
        state.error = action.error?.message || 'Failed to load invoices'
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.list.unshift(action.payload)
      })
  },
})

export default slice.reducer


