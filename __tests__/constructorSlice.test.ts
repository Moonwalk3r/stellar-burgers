import {
  constructorSlice,
  addIngredient,
  removeIngredients,
  resetIngredients,
  moveIngredient,
  initialState
} from '../src/services/slices/constructorSlice';
import { TConstructorIngredient } from '../src/utils/types';

describe('constructorSlice', () => {
  const ingredientsMock: Record<string, TConstructorIngredient> = {
    bun: {
      id: '1',
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
    meat: {
      id: '2',
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
    },
    mineralRings: {
      id: '3',
      _id: '643d69a5c3f7b9001cfa0946',
      name: 'Хрустящие минеральные кольца',
      type: 'main',
      proteins: 808,
      fat: 689,
      carbohydrates: 609,
      calories: 986,
      price: 300,
      image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
      image_mobile:
        'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
      image_large:
        'https://code.s3.yandex.net/react/code/mineral_rings-large.png'
    }
  };

  it('Возвращает начальное состояние', () => {
    expect(constructorSlice.reducer(undefined, { type: '@@INIT' })).toEqual(
      initialState
    );
  });

  it('Добавление булки', () => {
    const state = constructorSlice.reducer(
      initialState,
      addIngredient(ingredientsMock.bun)
    );
    expect(state.bun).toEqual(ingredientsMock.bun);
    expect(state.ingredients).toEqual([]);
  });

  it('Добавление ингредиента', () => {
    const state = constructorSlice.reducer(
      initialState,
      addIngredient(ingredientsMock.meat)
    );
    expect(state.ingredients).toEqual([ingredientsMock.meat]);
  });

  it('Удаление ингредиента', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [ingredientsMock.meat, ingredientsMock.mineralRings]
    };
    const state = constructorSlice.reducer(
      stateWithIngredients,
      removeIngredients(0)
    );
    expect(state.ingredients).toEqual([ingredientsMock.mineralRings]);
  });

  it('Сбрасывает ингедиенты', () => {
    const stateWithIngredients = {
      bun: ingredientsMock.bun,
      ingredients: [ingredientsMock.meat, ingredientsMock.mineralRings]
    };
    const state = constructorSlice.reducer(
      stateWithIngredients,
      resetIngredients()
    );
    expect(state).toEqual(initialState);
  });

  it('Перемещает ингердиенты', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [ingredientsMock.meat, ingredientsMock.mineralRings]
    };
    const state = constructorSlice.reducer(
      stateWithIngredients,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );
    expect(state.ingredients).toEqual([
      ingredientsMock.mineralRings,
      ingredientsMock.meat
    ]);
  });

  it('не должен перемещать ингредиент при некорректных индексах', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [ingredientsMock.meat, ingredientsMock.mineralRings]
    };
    const state = constructorSlice.reducer(
      stateWithIngredients,
      moveIngredient({ fromIndex: -1, toIndex: 1 })
    );
    expect(state.ingredients).toEqual([
      ingredientsMock.meat,
      ingredientsMock.mineralRings
    ]);
  });
});
