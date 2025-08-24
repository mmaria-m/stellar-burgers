import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

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
  },
  selectors: {
    selectBun: (state: BurgerConstructorState) => state.selectedBun,
    selectConstructorIngredients: (state: BurgerConstructorState) =>
      state.selectedIngredients,
    selectConstructorItems: (state: BurgerConstructorState) => ({
      bun: state.selectedBun,
      ingredients: state.selectedIngredients
    }),
    selectIngredientsCount: (state: BurgerConstructorState) => {
      const counts: { [key: string]: number } = {};
      if (state.selectedBun) {
        counts[state.selectedBun._id] = 2;
      }
      state.selectedIngredients.forEach((ingredient) => {
        counts[ingredient._id] = (counts[ingredient._id] || 0) + 1;
      });

      return counts;
    }
  }
});

export const {
  addIngredientToConstructor,
  clearConstructor,
  reorderConstructorIngredient,
  removeIngredientFromConstructor
} = burgerConstructorSlice.actions;

export const {
  selectBun,
  selectConstructorIngredients,
  selectConstructorItems,
  selectIngredientsCount
} = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
