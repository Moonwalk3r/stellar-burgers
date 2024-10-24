import { FC, useMemo, useEffect, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  getOrderByNum,
  selectOrderModal,
  selectOrders
} from '../../services/slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);
  const [orderData, setOrderData] = useState<TOrder | null>(null);

  const ingredients = useSelector(selectIngredients);
  const modalData = useSelector(selectOrderModal);
  const data = useSelector(selectOrders);

  useEffect(() => {
    if (orderNumber) {
      const order = data.find((item) => item.number === orderNumber);
      if (order) {
        setOrderData(order);
      } else {
        dispatch(getOrderByNum(orderNumber));
      }
    }
  }, [dispatch, orderNumber, data]);

  useEffect(() => {
    if (modalData && modalData.number === orderNumber) {
      setOrderData(modalData);
    }
  }, [modalData, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
