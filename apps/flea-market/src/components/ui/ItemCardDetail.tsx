import { Box, Card, IconButton, Stack } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ItemProps } from './ItemCard';
import { api } from '../../configs/api';
import { useApi } from '../../hooks/useApi';
import { useAuthUser } from '../../hooks/useAuthUser';
import LoadingOverlay from './LoadingOverlay';
import ConfirmationDialog, { ConfirmationDialogProps } from './ConfirmationDialog';
import ErrorDialog from './ErrorDialog';

type PaymentMethod = 'XYM' | 'STRIPE';

const ItemCardDetail = (itemProps: ItemProps) => {
  const navigate = useNavigate();
  const { store, item } = itemProps;
  const { itemId, itemName, itemPrice, itemPriceUnit, itemDescription, itemImageFile, itemStatus } = item;
  const { storeId, storeName, storeDescription, storeImageFile } = store;
  const [authUser, authUserLoading, authUserError] = useAuthUser();
  const [me, meLoading, meError] = useApi(() => api.getMe().catch(() => undefined), [authUser?.uid]);
  const [config, configLoading, configError] = useApi(() => api.getConfig(), []);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState<Error | undefined>(undefined);
  const [confirmationDialogState, setConfirmationDialogState] = useState<ConfirmationDialogProps | undefined>();

  const handleStoreAvatarClick = () => {
    void navigate(`/stores/${storeId}`);
  };

  const handleItemClick = () => {
    void navigate(`/stores/${storeId}/items/${itemId}`);
  };

  const handlePurchaseClick = (paymentMethod: PaymentMethod) => {
    if (!config?.enableCreateOrder) {
      setPurchaseError(Error('現在、注文を受け付けていません。'));
      return;
    }
    if (!authUser) {
      setPurchaseError(Error('買い物をするにはログインしてください'));
      return;
    }
    if (!me) {
      setPurchaseError(Error('買い物に必要なユーザー情報を取得できません'));
      return;
    }
    if (!me.name || !me.phoneNumber || !me.zipCode || !me.address1 || !me.address2) {
      setPurchaseError(
        Error('買い物に必要なユーザー情報が不足しています。まず最初に必要なユーザー情報を入力してください。'),
      );
      return;
    }
    if (paymentMethod === 'XYM' && !me.symbolAddress) {
      setPurchaseError(Error('XYM決済にはSymbolアドレスの登録が必要です。プロフィールから登録してください。'));
      return;
    }
    const { uid } = authUser;
    const message =
      paymentMethod === 'XYM'
        ? 'この商品を購入しますか？OKすると購入先店舗に発送先情報が共有され、Symbol(XYM)決済のページに進みます。'
        : 'この商品を購入しますか？OKすると購入先店舗に発送先情報が共有され、クレジットカード決済(Stripe)のページに進みます。';
    setConfirmationDialogState({
      title: '購入確認',
      message,
      onClose: (result: string) => {
        setConfirmationDialogState(undefined);
        if (result !== 'ok') {
          return;
        }
        setPurchaseLoading(true);
        api
          .createOrder({ itemId, paymentMethod })
          .then((res) => {
            if (res.url) {
              // Stripe Checkout: hand off to the hosted payment page.
              window.location.href = res.url;
            } else {
              // XYM: go to the order page, which renders the transfer QR + polls.
              void navigate(`/users/${uid}/orders/${res.orderId}`);
            }
          })
          .catch((err: unknown) => {
            setPurchaseError(err instanceof Error ? err : new Error(String(err)));
          })
          .finally(() => {
            setPurchaseLoading(false);
          });
      },
    });
  };

  const purchaseDisabled = !storeId || !itemId || itemStatus === 'SOLD_OUT';

  return (
    <>
      <Box sx={{ maxWidth: 'sm' }}>
        <Card>
          <CardHeader
            avatar={<Avatar src={storeImageFile} onClick={handleStoreAvatarClick} />}
            action={
              <IconButton onClick={handleStoreAvatarClick}>
                <MoreVertIcon />
              </IconButton>
            }
            title={storeName}
            subheader={storeDescription}
          />
          <CardMedia component="img" image={itemImageFile} alt={itemName} onClick={handleItemClick} />
          <CardContent>
            <Typography gutterBottom variant="h3" component="div">
              {itemName}
            </Typography>
            <Typography variant="h4" color="text.secondary">
              {`${itemPrice.toLocaleString()} ${itemPriceUnit === 'JPY' ? '円' : ''}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {itemDescription}
            </Typography>
          </CardContent>
          <CardActions>
            <Stack spacing={1} sx={{ width: '100%' }}>
              <Button size="large" disabled={purchaseDisabled} onClick={() => handlePurchaseClick('XYM')}>
                XYM(Symbol)で購入
              </Button>
              <Button size="large" disabled={purchaseDisabled} onClick={() => handlePurchaseClick('STRIPE')}>
                クレジットカードで購入
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </Box>
      <LoadingOverlay open={configLoading || authUserLoading || meLoading || purchaseLoading} />
      {confirmationDialogState ? <ConfirmationDialog {...confirmationDialogState} /> : null}
      <ErrorDialog open={!!configError} error={configError} />
      <ErrorDialog open={!!authUserError} error={authUserError} />
      <ErrorDialog open={!!meError} error={meError} />
      <ErrorDialog open={!!purchaseError} error={purchaseError} />
    </>
  );
};

export default ItemCardDetail;
