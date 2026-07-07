/* eslint-disable @typescript-eslint/no-misused-promises */
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Container, Stack, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useEffect } from 'react';
import { SYMBOL_NETWORK_NAME } from '../../../../configs/symbol';
import { api, ApiError } from '../../../../configs/api';
import { useApi } from '../../../../hooks/useApi';
import { useAuthUser } from '../../../../hooks/useAuthUser';
import LoadingOverlay from '../../../ui/LoadingOverlay';
import ErrorDialog from '../../../ui/ErrorDialog';

const User = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, loading, error] = useAuthUser();
  const [me, meLoading, meError] = useApi(() => api.getMe(), [user?.uid]);
  // getMyStore 404s when the owner hasn't created a store yet — treat that as "none".
  const [store, storeLoading, storeError] = useApi(
    () =>
      api.getMyStore().catch((e) => {
        if (e instanceof ApiError && e.status === 404) return null;
        throw e;
      }),
    [user?.uid],
  );
  const storeExists = !!store;

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!(user && userId && userId === user.uid)) {
      void navigate('/auth/sign-in/');
      return;
    }
    // Old userKycVerified === email-verified; keep the same gate.
    if (!user.emailVerified) {
      void navigate(`/users/${userId}/verify-user-email`);
    }
  }, [userId, user, loading, navigate]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(me?.symbolAddress ?? '');
  };

  const handleClick = () => {
    if (!userId) {
      throw Error('Invalid userId');
    }
    void navigate(`/users/${userId}/update`, {
      state: {
        name: me?.name ?? '',
        phoneNumber: me?.phoneNumber ?? '',
        zipCode: me?.zipCode ?? '',
        address1: me?.address1 ?? '',
        address2: me?.address2 ?? '',
        symbolAddress: me?.symbolAddress ?? '',
      },
    });
  };

  const handleStoreCreate = () => {
    if (!userId) {
      throw Error('Invalid userId');
    }
    void navigate(`/users/${userId}/stores/${userId}/create`);
  };

  const handleStore = () => {
    if (!userId) {
      throw Error('Invalid userId');
    }
    void navigate(`/users/${userId}/stores/${userId}`);
  };

  return (
    <>
      <Container maxWidth="sm">
        <h2>プロフィール</h2>
        <Stack>
          <div>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <h3>メールアドレス</h3>
              {user?.emailVerified ? (
                <CheckIcon color="success" />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/users/${userId ?? ''}/verify-user-email`}
                >
                  確認
                </Button>
              )}
            </Box>
            <div>{me?.email}</div>
          </div>
          <div>
            <h3>氏名</h3>
            <div>{me?.name}</div>
          </div>
          <div>
            <h3>電話番号</h3>
            <div>{me?.phoneNumber}</div>
          </div>
          <div>
            <h3>郵便番号</h3>
            <div>{me?.zipCode}</div>
          </div>
          <div>
            <h3>住所(都道府県市区町村)</h3>
            <div>{me?.address1}</div>
          </div>
          <div>
            <h3>住所(番地・建物名・部屋番号)</h3>
            <div>{me?.address2}</div>
          </div>
          <div>
            <h3>{`Symbolアドレス(${SYMBOL_NETWORK_NAME})`}</h3>
            <div style={{ fontSize: 12 }}>
              {me?.symbolAddress}
              <IconButton
                onClick={async () => {
                  await handleCopy();
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            </div>
          </div>
          <Button color="primary" variant="contained" size="large" onClick={handleClick}>
            編集
          </Button>
          <h2>店舗</h2>
          <Stack>
            {storeExists ? (
              <Button color="primary" variant="contained" size="large" onClick={handleStore}>
                店舗情報表示
              </Button>
            ) : (
              <Button color="primary" variant="contained" size="large" onClick={handleStoreCreate}>
                店舗情報登録
              </Button>
            )}
          </Stack>
        </Stack>
      </Container>
      <LoadingOverlay open={loading || meLoading || storeLoading} />
      <ErrorDialog open={!!(error ?? meError ?? storeError)} error={error ?? meError ?? storeError} />
    </>
  );
};

export default User;
