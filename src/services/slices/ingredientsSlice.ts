import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '../../utils/types';

export type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error?: string;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: undefined
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const res = await getIngredientsApi();
    return res;
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state: TIngredientsState) => state.ingredients,
    selectIsLoading: (state: TIngredientsState) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const { selectIngredients, selectIsLoading } =
  ingredientsSlice.selectors;
