import { getOrderByNumberApi, orderBurgerApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface OrderState {
  data: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (data: number) => {
    const res = await getOrderByNumberApi(data);
    return res.orders.length > 0 ? res.orders[0] : null;
  }
);

export const initialState: OrderState = {
  data: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'order/createOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderData: (state, action: PayloadAction<TOrder>) => {
      state.data = action.payload;
      state.error = null;
    },
    clearOrderError: (state) => {
      state.error = null;
      state.data = null;
      state.isLoading = false;
    },
    resetOrder: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder | null>) => {
          state.isLoading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  },
  selectors: {
    selectOrder: (state) => state.data,
    selectOrderLoading: (state) => state.isLoading,
    selectOrderError: (state) => state.error
  }
});

export const { setOrderData, clearOrderError, resetOrder } = orderSlice.actions;
export const { selectOrder, selectOrderLoading } = orderSlice.selectors;

export default orderSlice.reducer;
