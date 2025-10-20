import orderReducer, {
  createOrder,
  getOrderByNumber,
  setOrderData,
  clearOrderError,
  resetOrder,
  initialState
} from './orderSlice';
import { TOrder } from '../../utils/types';


const mockOrder: TOrder = {
  _id: 'order-1',
  number: 12345,
  status: 'done',
  name: 'Order',
  createdAt: '',
  updatedAt: '',
  ingredients: ['ingredient-1', 'ingredient-2']
};

describe('Order Slice', () => {

  describe('Async actions', () => {
    const testCases = [
      {
        name: 'createOrder',
        thunk: createOrder,
        successPayload: mockOrder
      },
      {
        name: 'getOrderByNumber', 
        thunk: getOrderByNumber,
        successPayload: mockOrder
      }
    ];

    testCases.forEach(({ name, thunk, successPayload }) => {
      describe(name, () => {
        it('should handle pending', () => {
          const state = orderReducer(initialState, { type: thunk.pending.type });
          expect(state.isLoading).toBe(true);
          expect(state.error).toBeNull();
        });

        it('should handle fulfilled', () => {
          const state = orderReducer(initialState, { 
            type: thunk.fulfilled.type, 
            payload: successPayload 
          });
          expect(state.isLoading).toBe(false);
          expect(state.data).toEqual(successPayload);
          expect(state.error).toBeNull();
        });

        it('should handle rejected', () => {
          const state = orderReducer(initialState, { 
            type: thunk.rejected.type, 
            error: { message: 'Error' } 
          });
          expect(state.isLoading).toBe(false);
          expect(state.error).toBe('Error');
        });
      });
    });
  });

 describe('Synch actions', () => {
  it('should handle setOrderData', () => {
    const state = orderReducer(initialState, setOrderData(mockOrder));
    expect(state.data).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  it('should handle clearOrderError', () => {
    const stateWithError = { ...initialState, error: 'Error', data: mockOrder, isLoading: true };
    const state = orderReducer(stateWithError, clearOrderError());
    expect(state.error).toBeNull();
    expect(state.data).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('should handle resetOrder', () => {
    const stateWithData = { ...initialState, data: mockOrder, error: 'Error', isLoading: true };
    const state = orderReducer(stateWithData, resetOrder());
    expect(state).toEqual(initialState);
  });
});

});