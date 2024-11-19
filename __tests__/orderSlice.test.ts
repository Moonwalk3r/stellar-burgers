import { configureStore } from '@reduxjs/toolkit';
import {
  orderSlice,
  getFeeds,
  getOrders,
  getOrderByNum,
  postOrder,
  resetOrder,
  initialState
} from '../src/services/slices/orderSlice';
import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../src/utils/burger-api';
import { TOrder } from '../src/utils/types';

jest.mock('../src/utils/burger-api', () => ({
  getFeedsApi: jest.fn(),
  getOrdersApi: jest.fn(),
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

describe('orderSlice', () => {
  const mockOrders: TOrder[] = [
    {
      _id: 'order1',
      status: 'done',
      name: 'Краторная булка N-200i',
      createdAt: '2024-10-01T00:00:00.000Z',
      updatedAt: '2024-10-01T00:00:00.000Z',
      number: 123,
      ingredients: []
    }
  ];

  it('должен вернуть начальное состояние', () => {
    const store = configureStore({ reducer: orderSlice.reducer });
    const state = store.getState();
    expect(state).toEqual(initialState);
  });

  it('должен получить данные о лентах (getFeeds)', async () => {
    const store = configureStore({ reducer: orderSlice.reducer });

    (getFeedsApi as jest.Mock).mockResolvedValue({
      orders: mockOrders,
      total: 10,
      totalToday: 5
    });

    await store.dispatch(getFeeds());

    const state = store.getState();
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(5);
    expect(state.error).toBeNull();
  });

  it('должен установить состояние ошибки при отклонении getFeeds', async () => {
    const store = configureStore({ reducer: orderSlice.reducer });

    (getFeedsApi as jest.Mock).mockRejectedValue(new Error('Ошибка загрузки'));

    await store.dispatch(getFeeds());

    const state = store.getState();
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual([]);
    expect(state.error).toBe('Ошибка загрузки');
  });

  it('должен получить профили заказов (getOrders)', async () => {
    const store = configureStore({ reducer: orderSlice.reducer });

    (getOrdersApi as jest.Mock).mockResolvedValue(mockOrders);

    await store.dispatch(getOrders());

    const state = store.getState();
    expect(state.isLoading).toBe(false);
    expect(state.profileOrders).toEqual(mockOrders);
    expect(state.error).toBeNull();
  });

  it('должен установить состояние ошибки при отклонении getOrders', async () => {
    const store = configureStore({ reducer: orderSlice.reducer });

    (getOrdersApi as jest.Mock).mockRejectedValue(new Error('Ошибка загрузки'));

    await store.dispatch(getOrders());

    const state = store.getState();
    expect(state.isLoading).toBe(false);
    expect(state.profileOrders).toEqual([]);
    expect(state.error).toBe('Ошибка загрузки');
  });

  it('должен получить заказ по номеру (getOrderByNum)', async () => {
    const store = configureStore({ reducer: orderSlice.reducer });

    (getOrderByNumberApi as jest.Mock).mockResolvedValue({
      orders: mockOrders
    });

    await store.dispatch(getOrderByNum(123));

    const state = store.getState();
    expect(state.isLoading).toBe(false);
    expect(state.orderModal).toEqual(mockOrders);
    expect(state.error).toBeNull();
  });

  it('должен установить состояние ошибки при отклонении getOrderByNum', async () => {
    const store = configureStore({ reducer: orderSlice.reducer });

    (getOrderByNumberApi as jest.Mock).mockRejectedValue(
      new Error('Ошибка получения заказа')
    );

    await store.dispatch(getOrderByNum(123));

    const state = store.getState();
    expect(state.isLoading).toBe(false);
    expect(state.orderModal).toEqual([]);
    expect(state.error).toBe('Ошибка получения заказа');
  });

  it('должен создать новый заказ (postOrder)', async () => {
    const store = configureStore({ reducer: orderSlice.reducer });
    const mockResponse = { name: 'Заказ создан', order: mockOrders[0] };

    (orderBurgerApi as jest.Mock).mockResolvedValue(mockResponse);

    await store.dispatch(postOrder(['ingredient1', 'ingredient2']));

    const state = store.getState();
    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(mockOrders[0]);
    expect(state.name).toBe('Заказ создан');
    expect(state.error).toBeNull();
  });

  it('должен установить состояние ошибки при отклонении postOrder', async () => {
    const store = configureStore({ reducer: orderSlice.reducer });

    (orderBurgerApi as jest.Mock).mockRejectedValue(
      new Error('Ошибка создания заказа')
    );

    await store.dispatch(postOrder(['ingredient1', 'ingredient2']));

    const state = store.getState();
    expect(state.isLoading).toBe(false);
    expect(state.order).toBeNull();
    expect(state.name).toBeNull();
    expect(state.error).toBe('Ошибка создания заказа');
  });

  it('должен сбросить состояние заказа (resetOrder)', () => {
    const store = configureStore({ reducer: orderSlice.reducer });
    store.dispatch(resetOrder());

    const state = store.getState();
    expect(state.order).toBeNull();
    expect(state.name).toBeNull();
  });
});
