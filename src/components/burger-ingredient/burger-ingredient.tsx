import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addIngredient } from '../../services/slices/constructorSlice';
import { useDispatch } from '../../services/store';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const constructorIngredient: TConstructorIngredient = {
      ...ingredient,
      id: nanoid()
    };

    const handleAdd = () => {
      dispatch(addIngredient(constructorIngredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
