import { getFeedsApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

interface feedState {
  feedOrders: TOrder[];
  totalOrders: number;
  totalTodayOrders: number;
  isLoading: boolean;
  error: string | null;
}

export const initialState: feedState = {
  feedOrders: [],
  totalOrders: 0,
  totalTodayOrders: 0,
  isLoading: false,
  error: null
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', async () => {
  const response = await getFeedsApi();
  return response;
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.isLoading = false;
          state.feedOrders = action.payload.orders;
          state.totalOrders = action.payload.total;
          state.totalTodayOrders = action.payload.totalToday;
        }
      )
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      });
  },
  selectors: {
    selectFeedOrders: (state: feedState) => state.feedOrders,
    selectTotalOrders: (state: feedState) => state.totalOrders,
    selectTotalOrdersToday: (state: feedState) => state.totalTodayOrders,
    selectFeedLoading: (state: feedState) => state.isLoading,
    selectFeedError: (state: feedState) => state.error
  }
});

export const {
  selectFeedOrders,
  selectTotalOrders,
  selectTotalOrdersToday,
  selectFeedLoading,
  selectFeedError
} = feedSlice.selectors;

export default feedSlice.reducer;
