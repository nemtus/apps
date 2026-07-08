/* eslint-disable @typescript-eslint/no-misused-promises */
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Button, Container, MenuItem, Stack, TextField } from '@mui/material';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { api } from '../../../../../../../../configs/api';
import { useApi } from '../../../../../../../../hooks/useApi';
import { useAuthUser } from '../../../../../../../../hooks/useAuthUser';
import LoadingOverlay from '../../../../../../../ui/LoadingOverlay';
import ErrorDialog from '../../../../../../../ui/ErrorDialog';

interface ItemCreateFormInput {
  itemName: string;
  itemPrice: number;
  itemPriceUnit: 'JPY';
  itemDescription: string;
  itemImageFile: string;
  itemStatus: 'ON_SALE' | 'SOLD_OUT';
}

const schema = yup.object({
  itemName: yup.string().required('必須です'),
  itemPrice: yup.number().min(1, '0より大きな値を入力してください').required('必須です'),
  itemPriceUnit: yup.string<'JPY'>().required('必須です').matches(/^JPY$/, '有効な値を選択してください'),
  itemDescription: yup.string().required('必須です'),
  itemImageFile: yup.string().defined(),
  itemStatus: yup
    .string<'ON_SALE' | 'SOLD_OUT'>()
    .required('必須です')
    .matches(/^(ON_SALE|SOLD_OUT)$/, '有効な値を選択してください'),
});

const ItemCreate = () => {
  const navigate = useNavigate();
  const { userId, storeId } = useParams();
  const [user, loading, error] = useAuthUser();
  const [me, meLoading, meError] = useApi(() => api.getMe(), [user?.uid]);
  const [config, configLoading, configError] = useApi(() => api.getConfig(), []);
  const [submitError, setSubmitError] = useState<Error | undefined>(undefined);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ItemCreateFormInput>({
    defaultValues: {
      itemName: '',
      itemPrice: 0,
      itemPriceUnit: 'JPY',
      itemDescription: '',
      itemImageFile: '',
      itemStatus: 'SOLD_OUT',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  const onSubmit: SubmitHandler<ItemCreateFormInput> = async (data) => {
    if (!config?.enableCreateItem) {
      setSubmitError(Error('現在、商品登録を受け付けていません。'));
      return;
    }
    if (!userId || userId !== user?.uid) {
      setSubmitError(Error('userId is not match with user.uid'));
      return;
    }
    if (storeId !== userId) {
      setSubmitError(Error('storeId is not match with userId'));
      return;
    }
    try {
      const created = await api.createMyItem(data);
      void navigate(`/users/${userId}/stores/${storeId}/items/${created.itemId}`);
    } catch (e) {
      setSubmitError(e instanceof Error ? e : new Error(String(e)));
    }
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

  return (
    <>
      <Container maxWidth="sm">
        <h2>商品登録</h2>
        <Stack spacing={3}>
          <TextField
            required
            label="商品名"
            type="text"
            {...register('itemName')}
            error={'itemName' in errors}
            helperText={errors.itemName?.message}
          />
          <TextField
            required
            label="商品価格"
            type="number"
            {...register('itemPrice')}
            error={'itemPrice' in errors}
            helperText={errors.itemPrice?.message}
          />
          <Controller
            name="itemPriceUnit"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                sx={{ mt: 2 }}
                label="通貨"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                <MenuItem value="JPY">円</MenuItem>
              </TextField>
            )}
          />
          <TextField
            required
            label="商品説明"
            type="text"
            {...register('itemDescription')}
            error={'itemDescription' in errors}
            helperText={errors.itemDescription?.message}
          />
          <Controller
            name="itemStatus"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                sx={{ mt: 2 }}
                label="販売状態"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                <MenuItem value="ON_SALE">販売中</MenuItem>
                <MenuItem value="SOLD_OUT">販売停止中</MenuItem>
              </TextField>
            )}
          />
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={handleSubmit(onSubmit)}
            disabled={!(user?.emailVerified && me?.storeKycVerified)}
          >
            登録して保存
          </Button>
        </Stack>
      </Container>
      <LoadingOverlay open={loading || meLoading || configLoading} />
      <ErrorDialog
        open={!!(error ?? meError ?? configError ?? submitError)}
        error={error ?? meError ?? configError ?? submitError}
      />
    </>
  );
};

export default ItemCreate;
