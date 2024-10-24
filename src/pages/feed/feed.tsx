import { FC, useEffect, useCallback } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import {
  selectIsLoading,
  selectOrders,
  getFeeds
} from '../../services/slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(selectOrders);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    if (!orders.length) {
      dispatch(getFeeds());
    }
  }, [dispatch, orders.length]);

  const handleGetFeeds = useCallback(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
