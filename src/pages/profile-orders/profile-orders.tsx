import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder, TIngredient } from '@utils-types';
import {
  selectProfileOrders,
  getOrders
} from '../../services/slices/orderSlice';
import {
  selectIngredients,
  fetchIngredients
} from '../../services/slices/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectProfileOrders);
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
    dispatch(getOrders());
  }, [dispatch, ingredients.length]);

  return <ProfileOrdersUI orders={orders} />;
};
