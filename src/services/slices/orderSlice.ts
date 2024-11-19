import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

const handleApiRequest = async (apiCall: () => Promise<any>) => {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    throw error;
  }
};

interface IOrderState {
  order: TOrder | null;
  name: string | null;
  error: string | null;
  isLoading: boolean;
  orders: TOrder[];
  orderModal: TOrder[];
  profileOrders: TOrder[];
  total: number | null;
  totalToday: number | null;
}

export const initialState: IOrderState = {
  order: null,
  name: null,
  error: null,
  isLoading: false,
  orders: [],
  orderModal: [],
  profileOrders: [],
  total: null,
  totalToday: null
};

export const getFeeds = createAsyncThunk('order/getFeeds', () =>
  handleApiRequest(getFeedsApi)
);

export const getOrders = createAsyncThunk('order/getOrders', () =>
  handleApiRequest(getOrdersApi)
);

export const getOrderByNum = createAsyncThunk(
  'order/getOrderByNum',
  (number: number) => handleApiRequest(() => getOrderByNumberApi(number))
);

export const postOrder = createAsyncThunk('order/postOrder', (data: string[]) =>
  handleApiRequest(() => orderBurgerApi(data))
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.name = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getFeeds
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Error fetching feeds';
        state.total = 0;
        state.totalToday = 0;
        state.orders = [];
      });

    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileOrders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Error fetching orders';
      });

    builder
      .addCase(getOrderByNum.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderByNum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModal = action.payload.orders;
      })
      .addCase(getOrderByNum.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Error fetching order by number';
      });

    builder
      .addCase(postOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.name;
        state.order = action.payload.order;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Error posting order';
      });
  },
  selectors: {
    selectOrder: (state: IOrderState) => state.order,
    selectOrders: (state: IOrderState) => state.orders,
    selectIsLoading: (state: IOrderState) => state.isLoading,
    selectOrderModal: (state: IOrderState) => state.orderModal[0],
    selectProfileOrders: (state: IOrderState) => state.profileOrders,
    selectTotal: (state: IOrderState) => state.total,
    selectTotalToday: (state: IOrderState) => state.totalToday
  }
});

export const {
  selectOrder,
  selectOrders,
  selectIsLoading,
  selectOrderModal,
  selectProfileOrders,
  selectTotal,
  selectTotalToday
} = orderSlice.selectors;

export const { resetOrder } = orderSlice.actions;
