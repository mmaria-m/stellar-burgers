import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie, getCookie } from '../../utils/cookie';

interface UserAuthState {
  user: TUser | null;
  isAuthChecked: boolean;
  authenticationError: string | undefined;
}

export const initialState: UserAuthState = {
  user: null,
  isAuthChecked: false,
  authenticationError: undefined
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ email, name, password }: TRegisterData) => {
    const response = await registerUserApi({ email, name, password });
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData) => {
    const response = await loginUserApi({ email, password });
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('accessToken');
});

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: TUser) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

export const performAuthCheck = createAsyncThunk(
  'user/performAuthCheck',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      await dispatch(fetchUser());
    }
    dispatch(setAuthChecked(true));
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    resetAuthState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.user = action.payload;
          state.isAuthChecked = true;
        }
      )
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.authenticationError = undefined;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.authenticationError = action.error.message;
      });
  },
  selectors: {
    selectUser: (state: UserAuthState) => state.user,
    selectIsAuthChecked: (state: UserAuthState) => state.isAuthChecked,
    selectAuthError: (state: UserAuthState) => state.authenticationError
  }
});

export const { setAuthChecked, resetAuthState } = userSlice.actions;

export const { selectUser, selectIsAuthChecked, selectAuthError } =
  userSlice.selectors;

export default userSlice.reducer;
