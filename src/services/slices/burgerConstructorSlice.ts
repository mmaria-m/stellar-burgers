import {
  createSlice,
  PayloadAction,
  nanoid,
  createSelector
} from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { RootState } from '../store';

export interface BurgerConstructorState {
  selectedBun: TConstructorIngredient | null;
  selectedIngredients: TConstructorIngredient[];
}

export const initialState: BurgerConstructorState = {
  selectedBun: null,
  selectedIngredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredientToConstructor: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.selectedBun = ingredient;
        } else {
          state.selectedIngredients.push(ingredient);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid()
        }
      })
    },
    removeIngredientFromConstructor: (state, action: PayloadAction<string>) => {
      state.selectedIngredients = state.selectedIngredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    clearConstructor: (state) => {
      state.selectedBun = null;
      state.selectedIngredients = [];
    },
    reorderConstructorIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredientsArray = state.selectedIngredients;
      [ingredientsArray[fromIndex], ingredientsArray[toIndex]] = [
        ingredientsArray[toIndex],
        ingredientsArray[fromIndex]
      ];
    }
  }
});

export const selectBun = (state: RootState) =>
  state.burgerConstructor.selectedBun;
export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.selectedIngredients;

export const selectConstructorItems = createSelector(
  [selectBun, selectConstructorIngredients],
  (bun, ingredients) => ({
    bun,
    ingredients
  })
);

export const selectIngredientsCount = createSelector(
  [selectBun, selectConstructorIngredients],
  (bun, ingredients) => {
    const counts: { [key: string]: number } = {};
    if (bun) {
      counts[bun._id] = 2;
    }
    ingredients.forEach((ingredient) => {
      counts[ingredient._id] = (counts[ingredient._id] || 0) + 1;
    });
    return counts;
  }
);

export const {
  addIngredientToConstructor,
  clearConstructor,
  reorderConstructorIngredient,
  removeIngredientFromConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
