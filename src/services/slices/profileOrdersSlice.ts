import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface ProfileOrdersState {
  profileOrderList: TOrder[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: ProfileOrdersState = {
  profileOrderList: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchHistory',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProfileOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.profileOrderList = action.payload;
        }
      )
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при загрузке заказов';
      });
  },
  selectors: {
    selectProfileOrderList: (state: ProfileOrdersState) =>
      state.profileOrderList,
    selectProfileOrdersStatus: (state: ProfileOrdersState) => ({
      isLoading: state.isLoading,
      error: state.error
    })
  }
});

export const { selectProfileOrderList, selectProfileOrdersStatus } =
  profileOrdersSlice.selectors;

export default profileOrdersSlice.reducer;
