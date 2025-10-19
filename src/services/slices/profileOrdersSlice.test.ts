import profileOrdersReducer, {
  fetchProfileOrders,
  initialState
} from './profileOrdersSlice';
import { TOrder } from '../../utils/types';

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

describe('Profile Orders Slice', () => {
  it('should handle pending', () => {
    const action = { type: fetchProfileOrders.pending.type };
    const state = profileOrdersReducer(initialState, action);
expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
  });

  it('should handle fulfilled', () => {
    
    const action = {
      type: fetchProfileOrders.fulfilled.type,
      payload: mockOrders
    };
    const state = profileOrdersReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        profileOrderList: mockOrders,
        error: null
      });
  });

  it('should handle rejected', () => {
    const errorMessage = 'Ошибка при загрузке заказов';
      const action = {
        type: fetchProfileOrders.rejected.type,
        error: { message: errorMessage }
      };
    const state = profileOrdersReducer(initialState, action);
     expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
  });
});