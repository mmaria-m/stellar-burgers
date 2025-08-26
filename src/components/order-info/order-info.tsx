import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { selectFeedOrders } from '../../services/slices/feedSlice';
import { selectAllIngredients } from '../../services/slices/ingredientsSlice';
import {
  selectOrder,
  selectOrderLoading,
  getOrderByNumber
} from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);
  const dispatch = useDispatch();

  const ingredients = useSelector(selectAllIngredients);
  const orderData = useSelector(selectOrder);
  const isLoading = useSelector(selectOrderLoading);

  // const orders = useSelector(selectFeedOrders);
  // const ingredients = useSelector(selectAllIngredients);
  // const orderData = orders.find((o) => String(o.number) === number);

  // useEffect(() => {
  //   dispatch(getOrderByNumber(orderNumber));
  // }, []);

  useEffect(() => {
    if (orderNumber) {
      dispatch(getOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
