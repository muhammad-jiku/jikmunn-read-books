import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Order, OrderConfirmation, PaymentMethod, ShippingAddress } from '@types/order';
import axios from 'axios';

interface OrderState {
  currentOrder: Order | null;
  orders: Order[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  hasMore: boolean;
}

const initialState: OrderState = {
  currentOrder: null,
  orders: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  hasMore: true,
};

// Place order
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (
    {
      shippingAddress,
      paymentMethod,
    }: {
      shippingAddress: ShippingAddress;
      paymentMethod: PaymentMethod;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post<OrderConfirmation>('/api/v1/orders', {
        shippingAddress,
        paymentMethod,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to place order');
    }
  },
);

// Fetch order details
export const fetchOrderDetails = createAsyncThunk(
  'order/fetchOrderDetails',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<Order>(`/api/v1/orders/${orderId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to fetch order details');
    }
  },
);

// Fetch order history
export const fetchOrderHistory = createAsyncThunk(
  'order/fetchOrderHistory',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get<{
        orders: Order[];
        total: number;
        page: number;
        hasMore: boolean;
      }>(`/api/v1/orders?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to fetch order history');
    }
  },
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post<Order>(`/api/v1/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to cancel order');
    }
  },
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Order History
      .addCase(fetchOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order,
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
