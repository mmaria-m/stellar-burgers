// добавление ингредиента в конструктор
// удаление ингредиента
// очищение коструктора
// перемещение

import constructorReducer, {
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  clearConstructor,
  reorderConstructorIngredient
//   initialState
} from './burgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '../../utils/types';

// jest.mock('uuid', () => ({
// 	v4: jest.fn(() => 'mocked-unique-id'),
// }))

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 300,
  price: 50,
  image: 'bun.png',
  image_mobile: 'bun-mobile.png',
  image_large: 'bun-large.png'
};

const mockMain: TIngredient = {
  _id: 'main-1',
  name: 'Main',
  type: 'main',
  proteins: 15,
  fat: 8,
  carbohydrates: 25,
  calories: 200,
  price: 150,
  image: 'main.png',
  image_mobile: 'main-mobile.png',
  image_large: 'main-large.png'
};

describe('Burger Constructor Slice', () => {
  const initialState = {
    selectedBun: null,
    selectedIngredients: []
  };
  // добавление булки
  describe('addIngredientToConstructor', () => {

    it('should add bun to constructor', () => {
      const action = addIngredientToConstructor(mockBun);
      const newState = constructorReducer(initialState, action);
      expect(newState.selectedBun).toEqual({
        ...mockBun,
        id: expect.any(String)
      });
      expect(newState.selectedIngredients).toEqual([]);
    });
    
    // добавление ингридиента
    it('should add main ingredient to constructor', () => {
    const action = addIngredientToConstructor(mockMain);
    const newState = constructorReducer(initialState, action);
    expect(newState.selectedBun).toBeNull();
    expect(newState.selectedIngredients).toHaveLength(1);
    expect(newState.selectedIngredients[0]).toEqual({
      ...mockMain,
      id: expect.any(String)
    });
  });

  });

  // удаление ингридиента
    describe('removeIngredientFromConstructor', () => {
        it('should remove ingredient by id', () => {
        const ingredientToRemove = { ...mockMain, id: 'unique-id' } as TConstructorIngredient;
        const stateWithIngredient = {
            selectedBun: null,
            selectedIngredients: [ingredientToRemove]
        };
        const action = removeIngredientFromConstructor('unique-id');
        const newState = constructorReducer(stateWithIngredient, action);
        expect(newState.selectedIngredients).toHaveLength(0);
        });
         });

    // очищение конструктора
    describe('clearConstructor', () => {
        it('should clear bun and all ingredients', () => {
        // const ingredientToRemove = { ...mockMain, id: 'unique-id' } as TConstructorIngredient;
        const stateWithIngredients = {
            selectedBun: { ...mockBun, id: 'bun-id' } as TConstructorIngredient,
        selectedIngredients: [{ ...mockMain, id: 'unique-id' } as TConstructorIngredient]
      };
      const action = clearConstructor();
      const newState = constructorReducer(stateWithIngredients, action);
      expect(newState.selectedBun).toBeNull();
      expect(newState.selectedIngredients).toEqual([]);
        });
    });

    // перемещение
      describe('reorderConstructorIngredient', () => {
    it('should move ingredient from one position to another', () => {
      const ingredient1 = { ...mockMain, id: 'ingredient-1' } as TConstructorIngredient;
      const ingredient2 = { ...mockMain, id: 'ingredient-2' } as TConstructorIngredient;
      const ingredient3 = { ...mockMain, id: 'ingredient-3' } as TConstructorIngredient;
      const stateWithIngredients = {
        selectedBun: null,
        selectedIngredients: [ingredient1, ingredient2, ingredient3]
      };
    const action = reorderConstructorIngredient({ fromIndex: 0, toIndex: 2 });
    const newState = constructorReducer(stateWithIngredients, action);
    expect(newState.selectedIngredients[0].id).toBe('ingredient-3');
    expect(newState.selectedIngredients[1].id).toBe('ingredient-2');
    expect(newState.selectedIngredients[2].id).toBe('ingredient-1');
    });
});

});