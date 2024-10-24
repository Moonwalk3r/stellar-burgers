import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const ingredients = useSelector(selectIngredients);
  const { id } = useParams();

  if (!ingredients || ingredients.length === 0) {
    return <Preloader />;
  }

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
