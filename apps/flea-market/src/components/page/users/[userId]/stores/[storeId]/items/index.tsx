/* eslint-disable @typescript-eslint/no-misused-promises */
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
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
import { useState, useEffect } from 'react';
import { api, ApiError } from '../../../../../../../configs/api';
import { useApi } from '../../../../../../../hooks/useApi';
import { useAuthUser } from '../../../../../../../hooks/useAuthUser';
import LoadingOverlay from '../../../../../../ui/LoadingOverlay';
import ErrorDialog from '../../../../../../ui/ErrorDialog';

interface Column {
  id: 'itemId' | 'itemName' | 'itemPrice' | 'itemPriceUnit' | 'itemDescription' | 'itemImageFile' | 'itemStatus';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  {
    id: 'itemId',
    label: '商品ID',
  },
  {
    id: 'itemName',
    label: '商品名',
  },
  {
    id: 'itemPrice',
    label: '価格',
  },
  {
    id: 'itemPriceUnit',
    label: '単位',
  },
  {
    id: 'itemStatus',
    label: 'ステータス',
  },
  {
    id: 'itemDescription',
    label: '商品説明',
  },
];

const Items = () => {
  const navigate = useNavigate();
  const { userId, storeId } = useParams();
  const [user, loading, error] = useAuthUser();
  const [me, meLoading, meError] = useApi(() => api.getMe(), [user?.uid]);
  // getMyStore 404s until a store is created — treat that as "no store yet".
  const [store, storeLoading, storeError] = useApi(
    () =>
      api.getMyStore().catch((e) => {
        if (e instanceof ApiError && e.status === 404) return null;
        throw e;
      }),
    [user?.uid],
  );
  const [items, itemsLoading, itemsError] = useApi(() => api.listMyItems().catch(() => []), [user?.uid]);
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
    if (loading || meLoading) {
      return;
    }
    if (!(user && userId && userId === user.uid)) {
      void navigate('/auth/sign-in/');
      return;
    }
    if (userId !== storeId) {
      void navigate(`/users/${userId}`);
      return;
    }
    // 旧 httpsOnCallVerifyKyc の userKycVerified/storeKycVerified ゲートの置き換え。
    if (!user.emailVerified) {
      void navigate(`/users/${userId}/verify-user-email`);
      return;
    }
    if (me && !me.storeKycVerified) {
      void navigate(`/users/${userId}/stores/${storeId}`);
    }
  }, [userId, storeId, user, loading, me, meLoading, navigate]);

  const handleStoreCreate = () => {
    void navigate(`/users/${userId ?? ''}/stores/${storeId ?? ''}/create`);
  };

  const handleItemCreate = () => {
    void navigate(`/users/${userId ?? ''}/stores/${storeId ?? ''}/items/create`);
  };

  return (
    <>
      {storeExists ? (
        <Container>
          <h2>商品情報</h2>
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
                  {(rowsPerPage > 0 ? items?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : items)?.map(
                    (document) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={document.itemId}>
                        {columns.map((column) => {
                          const value = document[column.id];
                          if (column.id === 'itemId' && userId && storeId) {
                            return (
                              <TableCell key={column.id} align={column.align} sx={{ wordBreak: 'break-all' }}>
                                <Link to={`/users/${userId}/stores/${storeId}/items/${value as string}`}>{value}</Link>
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
                    ),
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100, { label: 'All', value: -1 }]}
              component="div"
              count={items ? items.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={handleItemCreate}
            disabled={!(user?.emailVerified && me?.storeKycVerified)}
          >
            + 商品追加
          </Button>
        </Container>
      ) : (
        <Container maxWidth="sm">
          <h2>商品情報</h2>
          <Stack spacing="3">
            <div>
              <h3>店舗情報無し</h3>
              <div>出店及び商品登録を希望する場合は、まずは以下から店舗情報をご登録ください</div>
            </div>
            <Button color="primary" variant="contained" size="large" onClick={handleStoreCreate}>
              店舗登録
            </Button>
          </Stack>
        </Container>
      )}
      <LoadingOverlay open={loading || meLoading || storeLoading || itemsLoading} />
      <ErrorDialog
        open={!!(error ?? meError ?? storeError ?? itemsError)}
        error={error ?? meError ?? storeError ?? itemsError}
      />
    </>
  );
};

export default Items;
