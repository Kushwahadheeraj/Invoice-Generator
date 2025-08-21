import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { invoiceService, CreateInvoiceData } from '../../services'
import { RootState } from '../store'
import { Invoice } from '../../types'

export const fetchInvoices = createAsyncThunk<Invoice[], string[] | undefined, { state: RootState }>(
  'invoices/fetch',
  async (filters) => {
    return await invoiceService.getInvoices(filters)
  }
)

export const createInvoice = createAsyncThunk<Invoice, CreateInvoiceData, { state: RootState }>(
  'invoices/create',
  async (payload) => {
    return await invoiceService.createInvoice(payload)
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


