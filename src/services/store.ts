import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useAppDispatch,
  useSelector as useAppSelector
} from 'react-redux';

import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/burgerConstructorSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import orderReducer from './slices/orderSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';

export const rootReducer = combineSlices({
  burgerConstructor: constructorReducer,
  ingredients: ingredientsReducer,
  user: userReducer,
  feed: feedReducer,
  order: orderReducer,
  profileOrders: profileOrdersReducer
});

export const appStore = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof appStore.dispatch;
export const useDispatch: () => AppDispatch = () => useAppDispatch();
export const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

export default appStore;
