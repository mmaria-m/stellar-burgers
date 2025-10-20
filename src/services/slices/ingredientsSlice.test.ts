import ingredientsReducer, { fetchAllIngredients, initialState } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

describe('Ingredients Slice', () => {
  // const initialState = {
  //   availableIngredients: [],
  //   isLoading: false,
  //   error: null
  // };

    describe('fetchAllIngredients', () => {
    it('should handle pending state', () => {
      const action = { type: fetchAllIngredients.pending.type };
      const newState = ingredientsReducer(initialState, action);
     expect(newState).toEqual({
            ...initialState,
            isLoading: true,
            error: null
          });
    });
    });

    it('should handle fulfilled', () => {
      const mockIngredients: TIngredient[] = [
        {
          _id: 'ingredient-1',
          name: 'Test Ingredient 1',
          type: 'bun',
          proteins: 10,
          fat: 5,
          carbohydrates: 20,
          calories: 150,
          price: 100,
          image: 'image-1.png',
          image_mobile: 'mobile-1.png',
          image_large: 'large-1.png'
        },
        {
          _id: 'ingredient-2',
          name: 'Test Ingredient 2',
          type: 'main',
          proteins: 15,
          fat: 8,
          carbohydrates: 25,
          calories: 200,
          price: 150,
          image: 'image-2.png',
          image_mobile: 'mobile-2.png',
          image_large: 'large-2.png'
        }
      ];
      const action = {
        type: fetchAllIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const newState = ingredientsReducer(initialState, action);

    expect(newState).toEqual({
            ...initialState,
            availableIngredients: mockIngredients,
            isLoading: false
          });
    });

    it('should handle rejected', () => {
    const errorMessage = 'Ошибка загрузки';
      const action = { 
        type: fetchAllIngredients.rejected.type,
          error: { 
        message: errorMessage 
      } };
      const newState = ingredientsReducer(initialState, action);
      expect(newState).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
    });
  });
});