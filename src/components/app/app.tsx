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
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchAllIngredients } from '../../services/slices/ingredientsSlice';
import { performAuthCheck } from '../../services/slices/userSlice';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const background = location.state?.background;

  const feedMatch = useMatch('/feed/:number');
  const profileOrderMatch = useMatch('/profile/orders/:number');
  const orderNumber =
    feedMatch?.params.number || profileOrderMatch?.params.number;

  const handleModalClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(performAuthCheck());
    dispatch(fetchAllIngredients());
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(performAuthCheck()).then((action) => {
  //     if (action.payload) {
  //       dispatch(fetchProfileOrders());
  //     }
  //   });
  // }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/ingredients/:id'
          element={
            <p className={styles.detailPageWrap}>
              <IngredientDetails />
            </p>
          }
        />
        <Route path='/profile/orders/:number' element={<OrderInfo />} />

         */}
        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/ingredients/:id'
          element={
            <div className={styles.detailPageWrap}>
              <h2
                className={`text text_type_main-large ${styles.detailHeader}`}
              >
                Детали ингредиента
              </h2>
              <IngredientDetails />
            </div>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <div className={styles.detailPageWrap}>
              <h2
                className={`text text_type_main-large ${styles.detailHeader}`}
              >{`#${orderNumber}`}</h2>
              <OrderInfo />
            </div>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <div className={styles.detailPageWrap}>
              <h2
                className={`text text_type_main-large ${styles.detailHeader}`}
              >{`#${orderNumber}`}</h2>
              <OrderInfo />
            </div>
          }
        />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${orderNumber}`} onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title={`#${orderNumber}`} onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
