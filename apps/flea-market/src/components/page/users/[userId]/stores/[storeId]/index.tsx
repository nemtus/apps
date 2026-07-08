/* eslint-disable @typescript-eslint/no-misused-promises */
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Container, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useEffect } from 'react';
import { SYMBOL_NETWORK_NAME } from '../../../../../../configs/symbol';
import { api, ApiError } from '../../../../../../configs/api';
import { useApi } from '../../../../../../hooks/useApi';
import { useAuthUser } from '../../../../../../hooks/useAuthUser';
import LoadingOverlay from '../../../../../ui/LoadingOverlay';
import ErrorDialog from '../../../../../ui/ErrorDialog';

const Store = () => {
  const navigate = useNavigate();
  const { userId, storeId } = useParams();
  const [user, loading, error] = useAuthUser();
  // getMyStore 404s until a store is created — treat that as "no store yet".
  const [store, storeLoading, storeError] = useApi(
    () =>
      api.getMyStore().catch((e) => {
        if (e instanceof ApiError && e.status === 404) return null;
        throw e;
      }),
    [user?.uid],
  );
  // 店舗KYCフラグは api.getMe() から取得する（旧 httpsOnCallVerifyKyc の置き換え）。
  const [me, meLoading, meError] = useApi(() => api.getMe(), [user?.uid]);
  // 店舗の電話/住所KYCは env で opt-in。無効なら確認リンクを出さない（不要扱い）。
  const [config] = useApi(() => api.getConfig(), []);
  const storeExists = !!store;

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!(user && userId && userId === user.uid)) {
      void navigate('/auth/sign-in/');
      return;
    }
    if (userId !== storeId) {
      void navigate(`/users/${userId}`);
    }
  }, [userId, storeId, user, loading, navigate]);

  const handleStoreCreate = () => {
    void navigate(`/users/${userId ?? ''}/stores/${storeId ?? ''}/create`);
  };

  const handleStoreUpdate = () => {
    void navigate(`/users/${userId ?? ''}/stores/${storeId ?? ''}/update`, {
      state: {
        storeName: store?.storeName ?? '',
        storeEmail: store?.storeEmail ?? '',
        storePhoneNumber: store?.storePhoneNumber ?? '',
        storeZipCode: store?.storeZipCode ?? '',
        storeAddress1: store?.storeAddress1 ?? '',
        storeAddress2: store?.storeAddress2 ?? '',
        storeUrl: store?.storeUrl ?? '',
        storeSymbolAddress: store?.storeSymbolAddress ?? '',
        storeDescription: store?.storeDescription ?? '',
        storeImageFile: store?.storeImageFile ?? '',
        storeCoverImageFile: store?.storeCoverImageFile ?? '',
      },
    });
  };

  if (!userId || !user?.uid || userId !== user?.uid || userId !== storeId) {
    return null;
  }

  return (
    <>
      {storeExists ? (
        <Container maxWidth="sm">
          <h2>店舗情報</h2>
          <Stack spacing={3}>
            <div>
              <h3>店舗名</h3>
              <div>{store?.storeName}</div>
            </div>
            <div>
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <h3>店舗メールアドレス</h3>
                {me?.storeEmailVerified ? (
                  <CheckIcon color="success" />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/users/${userId}/stores/${storeId}/verify-store-email`}
                  >
                    確認
                  </Button>
                )}
              </Box>
              <div>{store?.storeEmail}</div>
            </div>
            <div>
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <h3>店舗電話番号</h3>
                {me?.storePhoneNumberVerified || !config?.enableStorePhoneVerification ? (
                  <CheckIcon color="success" />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/users/${userId}/stores/${storeId}/verify-store-phone-number`}
                  >
                    確認
                  </Button>
                )}
              </Box>
              <div>{store?.storePhoneNumber}</div>
            </div>
            <div>
              <h3>店舗郵便番号</h3>
              <div>{store?.storeZipCode}</div>
            </div>
            <div>
              <h3>店舗住所(都道府県市区町村)</h3>
              <div>{store?.storeAddress1}</div>
            </div>
            <div>
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <h3>店舗住所(番地・建物名・部屋番号)</h3>
                {me?.storeAddressVerified || !config?.enableStoreAddressVerification ? (
                  <CheckIcon color="success" />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/users/${userId}/stores/${storeId}/verify-store-address`}
                  >
                    確認
                  </Button>
                )}
              </Box>
              <div>{store?.storeAddress2}</div>
            </div>
            <div>
              <h3>店舗URL</h3>
              <div>
                <a href={store?.storeUrl}>{store?.storeUrl}</a>
              </div>
            </div>
            <div>
              <h3>{`店舗Symbolアドレス(${SYMBOL_NETWORK_NAME})`}</h3>
              <div>{store?.storeSymbolAddress}</div>
            </div>
            <div>
              <h3>店舗説明</h3>
              <div>{store?.storeDescription}</div>
            </div>
            <div>
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <h3>店舗画像</h3>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/users/${userId}/stores/${storeId}/upload-store-image`}
                >
                  画像設定
                </Button>
              </Box>
              <a href={store?.storeImageFile}>{store?.storeImageFile}</a>
              <img src={store?.storeImageFile} alt={store?.storeName} style={{ width: '100%' }} />
            </div>
            <Button color="primary" variant="contained" size="large" onClick={handleStoreUpdate}>
              店舗編集
            </Button>
          </Stack>
        </Container>
      ) : (
        <Container maxWidth="sm">
          <h2>店舗情報</h2>
          <Stack spacing="3">
            <div>
              <h3>店舗情報無し</h3>
              <div>出店を希望する場合は以下から店舗情報をご登録ください</div>
            </div>
            <Button color="primary" variant="contained" size="large" onClick={handleStoreCreate}>
              店舗登録
            </Button>
          </Stack>
        </Container>
      )}
      <LoadingOverlay open={loading || storeLoading || meLoading} />
      <ErrorDialog open={!!(error ?? storeError ?? meError)} error={error ?? storeError ?? meError} />
    </>
  );
};

export default Store;
