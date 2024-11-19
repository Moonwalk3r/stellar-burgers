import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

export type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
    },
    removeIngredients: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },
    resetIngredients: (state) => {
      state.bun = initialState.bun;
      state.ingredients = initialState.ingredients;
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      if (fromIndex < 0 || toIndex < 0 || toIndex >= state.ingredients.length)
        return;
      const [movedIngredient] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedIngredient);
    }
  },
  selectors: {
    selectConstructorState: (state: TConstructorState) => state,
    selectIngredients: (state: TConstructorState) => state.ingredients
  }
});

export const {
  addIngredient,
  removeIngredients,
  resetIngredients,
  moveIngredient
} = constructorSlice.actions;
export const { selectConstructorState, selectIngredients } =
  constructorSlice.selectors;
