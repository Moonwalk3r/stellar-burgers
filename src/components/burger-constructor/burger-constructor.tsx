import { FC, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  resetIngredients,
  selectConstructorState
} from '../../services/slices/constructorSlice';
import {
  selectIsLoading,
  selectOrder,
  resetOrder,
  postOrder
} from '../../services/slices/orderSlice';
import { selectUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(selectConstructorState);
  const orderRequest = useSelector(selectIsLoading);
  const orderModalData = useSelector(selectOrder);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const ingredientsIds = useMemo(() => {
    const bunId = constructorItems.bun?._id;
    const ingredientIds = constructorItems.ingredients
      .map((ingredient) => ingredient._id)
      .filter(Boolean);

    return [...ingredientIds, bunId, bunId].filter(Boolean) as string[];
  }, [constructorItems]);

  const onOrderClick = useCallback(() => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    dispatch(postOrder(ingredientsIds));
  }, [
    constructorItems.bun,
    orderRequest,
    user,
    navigate,
    dispatch,
    ingredientsIds
  ]);

  const closeOrderModal = useCallback(() => {
    dispatch(resetOrder());
    dispatch(resetIngredients());
  }, [dispatch]);

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (total: number, ingredient: TConstructorIngredient) =>
        total + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
