import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  removeIngredientFromConstructor,
  reorderConstructorIngredient
} from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(
          reorderConstructorIngredient({
            fromIndex: index,
            toIndex: index + 1
          })
        );
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(
          reorderConstructorIngredient({
            fromIndex: index,
            toIndex: index - 1
          })
        );
      }
    };

    const handleClose = () => {
      dispatch(removeIngredientFromConstructor(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
