/* eslint-disable @typescript-eslint/no-misused-promises */
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Container, Stack } from '@mui/material';
import { api } from '../../../../../../../../configs/api';
import { useApi } from '../../../../../../../../hooks/useApi';
import { useAuthUser } from '../../../../../../../../hooks/useAuthUser';
import LoadingOverlay from '../../../../../../../ui/LoadingOverlay';
import ErrorDialog from '../../../../../../../ui/ErrorDialog';

const Item = () => {
  const navigate = useNavigate();
  const { userId, storeId, itemId } = useParams();
  const [user, loading, error] = useAuthUser();
  const [me, meLoading, meError] = useApi(() => api.getMe(), [user?.uid]);
  // 単一のオーナー商品エンドポイントは無いため、オーナーの商品一覧から該当商品を取り出す。
  const [items, itemsLoading, itemsError] = useApi(() => api.listMyItems().catch(() => []), [user?.uid]);
  const item = items?.find((i) => i.itemId === itemId);
  const itemExists = !!item;

  const handleItems = () => {
    void navigate(`/users/${userId ?? ''}/stores/${storeId ?? ''}/items`);
  };

  const handleItemUpdate = () => {
    void navigate(`/users/${userId ?? ''}/stores/${storeId ?? ''}/items/${itemId ?? ''}/update`, {
      state: {
        itemName: item?.itemName,
        itemPrice: item?.itemPrice,
        itemPriceUnit: item?.itemPriceUnit,
        itemDescription: item?.itemDescription,
        itemImageFile: item?.itemImageFile,
        itemStatus: item?.itemStatus,
      },
    });
  };

  if (!userId || !storeId || !itemId || !user?.uid || userId !== user?.uid || userId !== storeId) {
    return null;
  }

  return (
    <>
      {itemExists ? (
        <Container maxWidth="sm">
          <h2>商品詳細</h2>
          <Stack spacing={3}>
            <div>
              <h3>商品ID</h3>
              <div>{item?.itemId}</div>
            </div>
            <div>
              <h3>商品名</h3>
              <div>{item?.itemName}</div>
            </div>
            <div>
              <h3>商品価格</h3>
              <div>{item?.itemPrice}</div>
            </div>
            <div>
              <h3>商品価格通貨</h3>
              <div>{item?.itemPriceUnit}</div>
            </div>
            <div>
              <h3>商品説明</h3>
              <div>{item?.itemDescription}</div>
            </div>
            <div>
              <h3>商品ステータス</h3>
              <div>{item?.itemStatus}</div>
            </div>
            <div>
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <h3>商品画像</h3>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/users/${userId}/stores/${storeId}/items/${itemId}/upload-item-image`}
                >
                  画像設定
                </Button>
              </Box>
              <a href={item?.itemImageFile}>{item?.itemImageFile}</a>
              <img src={item?.itemImageFile} alt={item?.itemName} style={{ width: '100%' }} />
            </div>
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={handleItemUpdate}
              disabled={!(user?.emailVerified && me?.storeKycVerified)}
            >
              商品編集
            </Button>
          </Stack>
        </Container>
      ) : (
        <Container maxWidth="sm">
          <h2>商品詳細</h2>
          <Stack spacing="3">
            <div>
              <h3>商品登録無し</h3>
              <div>ご指定のIDの商品は見つかりませんでした。以下の商品一覧ページから商品をご確認ください。</div>
            </div>
            <Button color="primary" variant="contained" size="large" onClick={handleItems}>
              商品一覧ページ
            </Button>
          </Stack>
        </Container>
      )}
      <LoadingOverlay open={loading || meLoading || itemsLoading} />
      <ErrorDialog open={!!(error ?? meError ?? itemsError)} error={error ?? meError ?? itemsError} />
    </>
  );
};

export default Item;
