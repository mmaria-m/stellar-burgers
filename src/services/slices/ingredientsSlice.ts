import { getIngredientsApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface IngredientCatalogState {
  availableIngredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: IngredientCatalogState = {
  availableIngredients: [],
  isLoading: false,
  error: null
};

export const fetchAllIngredients = createAsyncThunk(
  'ingredients/fetchAllIngredients',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAllIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.isLoading = false;
          state.availableIngredients = action.payload;
        }
      )
      .addCase(fetchAllIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load ingredients';
      });
  },
  selectors: {
    selectAllIngredients: (state: IngredientCatalogState) =>
      state.availableIngredients,

    selectIngredientsLoadingStatus: (state: IngredientCatalogState) =>
      state.isLoading,

    selectIngredientsErrorStatus: (state: IngredientCatalogState) => state.error
  }
});

export const {
  selectAllIngredients,
  selectIngredientsLoadingStatus,
  selectIngredientsErrorStatus
} = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
