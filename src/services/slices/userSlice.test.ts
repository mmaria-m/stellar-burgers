import userReducer, {
  registerUser,
  loginUser,
  logoutUser,
  fetchUser,
  updateUser,
  initialState
} from './userSlice';

import { TUser } from '../../utils/types';

const mockUser: TUser = {
  name: 'Test User',
  email: 'test@example.com'
};

describe('User Slice', () => {
  it('should return initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

    describe('registerUser', () => {
      it('should handle fulfilled', () => {
        const action = {
          type: registerUser.fulfilled.type,
          payload: mockUser
        };
        const state = userReducer(initialState, action);
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthChecked).toBe(true);
        expect(state.authenticationError).toBeUndefined();
      });
     it('should handle rejected', () => {
        const errorMessage = 'Registration failed';
        const action = {
          type: registerUser.rejected.type,
          error: { message: errorMessage }
        };
        const state = userReducer(initialState, action);
      expect(state.authenticationError).toBeUndefined();
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(false);
      });
    });

    describe('loginUser', () => {
      it('should handle fulfilled', () => {
        const action = {
          type: loginUser.fulfilled.type,
          payload: mockUser
        };
        const state = userReducer(initialState, action);
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthChecked).toBe(true);
        expect(state.authenticationError).toBeUndefined();
      });
 it('should handle rejected', () => {
        const errorMessage = 'Login failed';
        const action = {
          type: loginUser.rejected.type,
          error: { message: errorMessage }
        };
        const state = userReducer(initialState, action);
        expect(state.authenticationError).toBeUndefined();
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(false);
      });
    });
describe('logoutUser', () => {
      it('should handle fulfilled', () => {
        const stateWithUser = {
          ...initialState,
          user: mockUser,
          isAuthChecked: true
        };
        const action = {
          type: logoutUser.fulfilled.type
        };
        const state = userReducer(stateWithUser, action);
        expect(state.user).toBeNull();
        expect(state.isAuthChecked).toBe(true); 
      });
    });
    describe('fetchUser', () => {
      it('should handle fulfilled', () => {
        const action = {
          type: fetchUser.fulfilled.type,
          payload: mockUser
        };
        const state = userReducer(initialState, action);
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthChecked).toBe(true);
        expect(state.authenticationError).toBeUndefined();
      });
           it('should handle rejected', () => {
        const action = {
          type: fetchUser.rejected.type
        };
        const state = userReducer(initialState, action);
        expect(state.isAuthChecked).toBe(true);
        expect(state.user).toBeNull();
        expect(state.authenticationError).toBeUndefined();
      });
    });
  describe('updateUser', () => {
      it('should handle fulfilled', () => {
        const updatedUser: TUser = {
          name: 'Updated User',
          email: 'updated@example.com'
        };
        const action = {
          type: updateUser.fulfilled.type,
          payload: updatedUser
        };
        const state = userReducer(initialState, action);
        expect(state.user).toEqual(updatedUser);
        expect(state.authenticationError).toBeUndefined();
      });
           it('should handle rejected', () => {
        const errorMessage = 'Update failed';
        const action = {
          type: updateUser.rejected.type,
          error: { message: errorMessage }
        };
        const state = userReducer(initialState, action);
        expect(state.authenticationError).toBe(errorMessage);
        
      });
    });
  });
