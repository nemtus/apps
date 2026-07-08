import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { SYMBOL_BLOCK_EXPLORER_URL } from '../../../../../../../configs/symbol';
import { api, ApiError } from '../../../../../../../configs/api';
import { useApi } from '../../../../../../../hooks/useApi';
import { useAuthUser } from '../../../../../../../hooks/useAuthUser';
import LoadingOverlay from '../../../../../../ui/LoadingOverlay';
import ErrorDialog from '../../../../../../ui/ErrorDialog';

interface Column {
  id: // | 'userId'
    | 'email'
    | 'name'
    | 'phoneNumber'
    | 'zipCode'
    | 'address1'
    | 'address2'
    // | 'symbolAddress'
    | 'orderId'
    // | 'orderAmount'
    | 'orderTotalPrice'
    | 'orderTotalPriceUnit'
    | 'orderTotalPriceCC'
    | 'orderTotalPriceCCUnit'
    | 'orderTxHash'
    | 'orderStatus'
    // | 'itemId'
    | 'itemName';
  // | 'itemPrice'
  // | 'itemPriceUnit'
  // | 'itemDescription'
  // | 'itemImageFile'
  // | 'itemStatus';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  // {
  //   id: 'userId',
  //   label: 'お客様ID',
  // },
  {
    id: 'email',
    label: 'お客様メールアドレス',
  },
  {
    id: 'name',
    label: 'お客様名',
  },
  {
    id: 'phoneNumber',
    label: 'お客様電話番号',
  },
  {
    id: 'zipCode',
    label: 'お客様郵便番号',
  },
  {
    id: 'address1',
    label: 'お客様住所1',
  },
  {
    id: 'address2',
    label: 'お客様住所2',
  },
  // {
  //   id: 'symbolAddress',
  //   label: 'お客様Symbolアドレス',
  // },
  {
    id: 'orderId',
    label: '注文ID',
  },
  // {
  //   id: 'orderAmount',
  //   label: '注文数量',
  // },
  {
    id: 'orderTotalPrice',
    label: '注文金額',
  },
  {
    id: 'orderTotalPriceUnit',
    label: '注文通貨',
  },
  {
    id: 'orderTotalPriceCC',
    label: '注文金額',
    format: (value: number) => (value / 1_000_000).toString(),
  },
  {
    id: 'orderTotalPriceCCUnit',
    label: '注文通貨',
  },
  {
    id: 'orderTxHash',
    label: '注文 Tx Hash',
  },
  {
    id: 'orderStatus',
    label: '注文状態',
  },
  // {
  //   id: 'itemId',
  //   label: '商品ID',
  // },
  {
    id: 'itemName',
    label: '商品名',
  },
  // {
  //   id: 'itemPrice',
  //   label: '価格',
  // },
  // {
  //   id: 'itemPriceUnit',
  //   label: '単位',
  // },
  // {
  //   id: 'itemStatus',
  //   label: 'ステータス',
  // },
  // {
  //   id: 'itemDescription',
  //   label: '商品説明',
  // },
];

const OrdersForStore = () => {
  const navigate = useNavigate();
  const { userId, storeId } = useParams();
  const [authUser, authUserLoading, authUserError] = useAuthUser();
  const [me, meLoading, meError] = useApi(() => api.getMe(), [authUser?.uid]);
  const [store, storeLoading, storeError] = useApi(
    () =>
      api.getMyStore().catch((e) => {
        if (e instanceof ApiError && e.status === 404) return null;
        throw e;
      }),
    [authUser?.uid],
  );
  const [orders, ordersLoading, ordersError] = useApi(() => api.listMyStoreOrders().catch(() => []), [authUser?.uid]);
  const storeExists = !!store;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(-1);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (authUserLoading || meLoading) {
      return;
    }
    if (!(authUser && userId && userId === authUser.uid)) {
      void navigate('/auth/sign-in/');
      return;
    }
    if (userId !== storeId) {
      void navigate(`/users/${userId}`);
      return;
    }
    // 旧 httpsOnCallVerifyKyc の userKycVerified/storeKycVerified ゲートの置き換え。
    if (!authUser.emailVerified) {
      void navigate(`/users/${userId}/verify-user-email`);
      return;
    }
    if (me && !me.storeKycVerified) {
      void navigate(`/users/${userId}/stores/${storeId}`);
    }
  }, [userId, storeId, authUser, authUserLoading, me, meLoading, navigate]);

  return (
    <>
      {storeExists ? (
        <Container>
          <h2>注文情報</h2>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? orders?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : orders
                  )?.map((document) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={document.orderId}>
                      {columns.map((column) => {
                        const value = document[column.id];
                        if (column.id === 'orderTxHash' && typeof value === 'string') {
                          return (
                            <TableCell key={column.id} align={column.align} sx={{ wordBreak: 'break-all' }}>
                              <a href={`${SYMBOL_BLOCK_EXPLORER_URL}/transactions/${value}`}>{value}</a>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id} align={column.align} sx={{ wordBreak: 'break-all' }}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100, { label: 'All', value: -1 }]}
              component="div"
              count={orders ? orders.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Container>
      ) : (
        <Container maxWidth="sm">
          <h2>注文情報</h2>
          <Stack spacing="3">
            <div>
              <h3>注文情報無し</h3>
              <div>お客様からの注文はまだ無いようです。</div>
            </div>
          </Stack>
        </Container>
      )}
      <LoadingOverlay open={authUserLoading || meLoading || storeLoading || ordersLoading} />
      <ErrorDialog
        open={!!(authUserError ?? meError ?? storeError ?? ordersError)}
        error={authUserError ?? meError ?? storeError ?? ordersError}
      />
    </>
  );
};

export default OrdersForStore;
