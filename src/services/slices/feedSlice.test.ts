import feedReducer, { fetchFeed, initialState } from './feedSlice';
import { TOrder } from '../../utils/types';

describe('Feed Slice', () => {

  it('should handle pending', () => {
    const action = { type: fetchFeed.pending.type };
    const state = feedReducer(initialState, action);

     expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
  });

  it('should handle fulfilled', () => {
    const mockOrders: TOrder[] = [
      {
        _id: '1',
        number: 1,
        status: 'done',
        name: 'Order 1',
        createdAt: '',
        updatedAt: '',
        ingredients: []
      }
    ];
    const action = {
      type: fetchFeed.fulfilled.type,
      payload: { orders: mockOrders, total: 100, totalToday: 10 }
    };
    const state = feedReducer(initialState, action);

       expect(state).toEqual({
        ...initialState,
        isLoading: false,
        feedOrders: mockOrders,
        totalOrders: 100,
        totalTodayOrders: 10,
        error: null
      });
  });


  it('should handle rejected', () => {
    const errorMessage = 'Ошибка при загрузке ленты заказов';
    const action = { type: fetchFeed.rejected.type, error: { message: errorMessage } };
    const state = feedReducer(initialState, action);
     expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
});
});