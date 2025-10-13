import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

import { useDispatch, useSelector } from '../../services/store';
import {
  addIngredientToConstructor,
  selectIngredientsCount
} from '../../services/slices/burgerConstructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const ingredientsCount = useSelector(selectIngredientsCount);

    const handleAdd = () => {
      dispatch(addIngredientToConstructor(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={ingredientsCount[ingredient._id]}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
