import { configureStore } from '@reduxjs/toolkit';
import {
  ingredientsSlice,
  fetchIngredients,
  initialState
} from '../src/services/slices/ingredientsSlice';
import { TIngredient } from '../src/utils/types';
import { getIngredientsApi } from '../src/utils/burger-api';

jest.mock('../src/utils/burger-api', () => ({ getIngredientsApi: jest.fn() }));

describe('ingredientsSlice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0940',
      name: 'Говяжий метеорит (отбивная)',
      type: 'main',
      proteins: 800,
      fat: 800,
      carbohydrates: 300,
      calories: 2674,
      price: 3000,
      image: 'https://code.s3.yandex.net/react/code/meat-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
    }
  ];

  it('должен вернуть начальное состояние', () => {
    const store = configureStore({ reducer: ingredientsSlice.reducer });
    expect(store.getState()).toEqual(initialState);
  });

  it('должен изменить состояние на загрузку при вызове fetchIngredients', async () => {
    const store = configureStore({ reducer: ingredientsSlice.reducer });
    (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);

    await store.dispatch(fetchIngredients());

    const state = store.getState();
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      ingredients: mockIngredients
    });
  });

  it('должен установить состояние ошибки при отклонении fetchIngredients', async () => {
    const store = configureStore({ reducer: ingredientsSlice.reducer });
    (getIngredientsApi as jest.Mock).mockRejectedValue(
      new Error('Ошибка загрузки')
    );

    await store.dispatch(fetchIngredients());

    const state = store.getState();
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      ingredients: [],
      error: 'Ошибка загрузки'
    });
  });

  it('должен изменять состояние на загрузку при вызове fetchIngredients', async () => {
    const store = configureStore({ reducer: ingredientsSlice.reducer });
    (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);

    const fetchPromise = store.dispatch(fetchIngredients());

    expect(store.getState().isLoading).toBe(true);

    await fetchPromise;

    expect(store.getState().isLoading).toBe(false);
  });
});
