import { FC, memo, useCallback } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  removeIngredients,
  moveIngredient
} from '../../services/slices/constructorSlice';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = useCallback(() => {
      if (index < totalItems - 1) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1 }));
      }
    }, [dispatch, index, totalItems]);

    const handleMoveUp = useCallback(() => {
      if (index > 0) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1 }));
      }
    }, [dispatch, index]);

    const handleClose = useCallback(() => {
      dispatch(removeIngredients(index));
    }, [dispatch, index]);

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
