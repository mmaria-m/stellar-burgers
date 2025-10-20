import { appStore } from './store';

describe('Store Configuration', () => {
  it('should return initial state for unknown action', () => {
    const initialState = appStore.getState();

    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('order');
    expect(initialState).toHaveProperty('profileOrders');
    expect(initialState).toHaveProperty('user');
    
  });

  it('should handle unknown action without errors', () => {
    const initialState = appStore.getState();

    appStore.dispatch({ type: 'UNKNOWN_ACTION' });

    const newState = appStore.getState();

    expect(newState).toEqual(initialState);
  });

  });