import store, { RootState } from '../src/services/store';
import { userSlice } from '../src/services/slices/userSlice';
import { ingredientsSlice } from '../src/services/slices/ingredientsSlice';
import { constructorSlice } from '../src/services/slices/constructorSlice';
import { orderSlice } from '../src/services/slices/orderSlice';

describe('Redux Store', () => {
  it('должен возвращать корректное начальное состояние', () => {
    const initialState: RootState = {
      auth: userSlice.getInitialState(),
      ingredients: ingredientsSlice.getInitialState(),
      burgerConstructor: constructorSlice.getInitialState(),
      order: orderSlice.getInitialState()
    };

    const state = store.getState();

    expect(state).toEqual(initialState);
  });

  it('должен обрабатывать экшен "UNKNOWN_ACTION"', () => {
    const previousState = {
      auth: { user: null, isAuthChecked: false, error: null },
      ingredients: { ingredients: [], error: undefined, isLoading: false },
      burgerConstructor: { bun: null, ingredients: [] },
      order: {
        order: null,
        name: null,
        total: null,
        totalToday: null,
        orderModal: [],
        orders: [],
        profileOrders: [],
        error: null,
        isLoading: false
      }
    };

    store.dispatch({ type: 'UNKNOWN_ACTION' });

    const state = store.getState();

    expect(state).toEqual(previousState);
  });
});
