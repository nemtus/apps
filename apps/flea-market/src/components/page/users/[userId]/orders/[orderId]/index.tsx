import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import OrderCardDetail from '../../../../../ui/OrderCardDetails';
import { api } from '../../../../../../configs/api';
import { useApi } from '../../../../../../hooks/useApi';
import { useAuthUser } from '../../../../../../hooks/useAuthUser';
import LoadingOverlay from '../../../../../ui/LoadingOverlay';
import ErrorDialog from '../../../../../ui/ErrorDialog';

const OrderForUser = () => {
  const { userId, orderId } = useParams();
  const [authUser, authUserLoading, authUserError] = useAuthUser();
  const [tick, setTick] = useState(0);
  const [order, orderLoading, orderError] = useApi(() => api.getOrder(orderId ?? ''), [orderId, tick]);

  // XYM 注文が PENDING/UNCONFIRMED の間は着金確認をポーリングし、確定したら再取得する。worker が
  // Symbol REST で orderId 宛の送金を照合するため、クライアントは txHash を知る必要がない。
  useEffect(() => {
    if (!orderId || !order || order.paymentMethod !== 'XYM') {
      return undefined;
    }
    if (order.orderStatus !== 'PENDING' && order.orderStatus !== 'UNCONFIRMED') {
      return undefined;
    }
    const interval = setInterval(() => {
      api
        .verifyOrderPayment(orderId)
        .then((updated) => {
          if (updated.orderStatus === 'CONFIRMED') setTick((t) => t + 1);
        })
        .catch(() => {
          // まだ着金していない/一時的なノードエラー。次のポーリングで再試行する。
        });
    }, 12_000);
    return () => clearInterval(interval);
  }, [orderId, order]);

  if (!authUser || authUser.uid !== userId || !orderId) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      {order ? <OrderCardDetail order={order} key={orderId} /> : null}
      <LoadingOverlay open={orderLoading || authUserLoading} />
      <ErrorDialog open={!!(orderError ?? authUserError)} error={orderError ?? authUserError} />
    </Container>
  );
};

export default OrderForUser;
