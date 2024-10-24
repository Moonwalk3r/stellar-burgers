import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { userAuth } from '../../services/slices/userSlice';
import { OnlyAuth, ProtectedRoute } from '../protected-route/protected-route';
import { useDispatch } from '../../services/store';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background || null;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(userAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<OnlyAuth component={<Login />} />} />
        <Route
          path='/register'
          element={<OnlyAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<OnlyAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<OnlyAuth component={<ResetPassword />} />}
        />
        <Route
          path='/profile'
          element={<ProtectedRoute component={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute component={<ProfileOrders />} />}
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute component={<OrderInfo />} />}
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                component={
                  <Modal
                    title={location.pathname.split('/')[3]}
                    onClose={() => navigate(-1)}
                  >
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
