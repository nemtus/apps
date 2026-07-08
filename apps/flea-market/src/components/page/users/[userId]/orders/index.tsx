import { useParams } from 'react-router-dom';
import { api } from '../../../../../configs/api';
import { useApi } from '../../../../../hooks/useApi';
import { useAuthUser } from '../../../../../hooks/useAuthUser';
import OrderCard from '../../../../ui/OrderCard';
import LoadingOverlay from '../../../../ui/LoadingOverlay';
import ErrorDialog from '../../../../ui/ErrorDialog';

export const OrdersForUser = () => {
  const { userId } = useParams();
  const [user, loading, error] = useAuthUser();
  const [orders, ordersLoading, ordersError] = useApi(() => api.listMyOrders(), [user?.uid]);
  const owner = !!user && !!userId && userId === user.uid;

  return (
    <>
      <h2>注文履歴</h2>
      {owner && orders ? orders.map((order) => <OrderCard key={order.orderId} order={order} />) : null}
      <LoadingOverlay open={loading || ordersLoading} />
      <ErrorDialog open={!!(error ?? ordersError)} error={error ?? ordersError} />
    </>
  );
};

export default OrdersForUser;
