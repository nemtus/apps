/* eslint-disable @typescript-eslint/no-misused-promises */
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Button, Container, Stack, TextField } from '@mui/material';
import * as yup from 'yup';
import { SYMBOL_NETWORK_NAME, SYMBOL_ADDRESS_REG_EXP, SYMBOL_PREFIX } from '../../../../configs/symbol';
import { api } from '../../../../configs/api';
import { useApi } from '../../../../hooks/useApi';
import { useAuthUser } from '../../../../hooks/useAuthUser';
import LoadingOverlay from '../../../ui/LoadingOverlay';
import ErrorDialog from '../../../ui/ErrorDialog';

interface UserCreateFormInput {
  name: string;
  phoneNumber: string;
  zipCode: string;
  address1: string;
  address2: string;
  symbolAddress: string;
}

const schema = yup.object({
  name: yup.string().required('必須です'),
  phoneNumber: yup
    .string()
    .required('必須です')
    .matches(
      /^(((0(\d{1}[-(]?\d{4}|\d{2}[-(]?\d{3}|\d{3}[-(]?\d{2}|\d{4}[-(]?\d{1}|[5789]0[-(]?\d{4})[-)]?)|\d{1,4}-?)\d{4}|0120[-(]?\d{3}[-)]?\d{3})$/,
      '有効な日本の電話番号を入力してください',
    ),
  zipCode: yup
    .string()
    .required('必須です')
    .matches(/^\d{7}$/, '郵便番号は7桁の半角数字でハイフン無しで入力してください'),
  address1: yup.string().required('必須です'),
  address2: yup.string().required('必須です'),
  symbolAddress: yup
    .string()
    .required('必須です')
    .matches(
      SYMBOL_ADDRESS_REG_EXP,
      `Symbolアドレスは${SYMBOL_PREFIX}から始まる39文字の半角大文字英数字で入力してください`,
    ),
});

const UserCreate = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, loading, error] = useAuthUser();
  const [config, configLoading, configError] = useApi(() => api.getConfig(), []);
  const [submitError, setSubmitError] = useState<Error | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCreateFormInput>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  const onSubmit: SubmitHandler<UserCreateFormInput> = async (data) => {
    if (!config?.enableCreateUser) {
      setSubmitError(Error('現在、ユーザー登録を受け付けていません。'));
      return;
    }
    if (!userId) {
      setSubmitError(Error('Invalid userId'));
      return;
    }
    if (userId !== user?.uid) {
      setSubmitError(Error('userId is not match with user.uid'));
      return;
    }
    try {
      await api.updateMe(data);
      void navigate(`/users/${userId}`);
    } catch (e) {
      setSubmitError(e instanceof Error ? e : new Error(String(e)));
    }
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!(user && userId && userId === user.uid)) {
      void navigate('/auth/sign-in/');
      return;
    }
    // メール確認は旧 httpsOnCallVerifyKyc の emailVerified ゲートの置き換え。
    if (!user.emailVerified) {
      void navigate(`/users/${userId}/verify-user-email`);
    }
  }, [userId, user, loading, navigate]);

  return (
    <>
      <Container maxWidth="sm">
        <h2>プロフィール登録</h2>
        <Stack spacing={3}>
          <TextField
            required
            label="氏名"
            type="text"
            {...register('name')}
            error={'name' in errors}
            helperText={errors.name?.message}
          />
          <TextField
            required
            label="電話番号"
            type="text"
            {...register('phoneNumber')}
            error={'phoneNumber' in errors}
            helperText={errors.phoneNumber?.message}
          />
          <TextField
            required
            label="郵便番号"
            type="text"
            {...register('zipCode')}
            error={'zipCode' in errors}
            helperText={errors.zipCode?.message}
          />
          <TextField
            required
            label="住所(都道府県市区町村)"
            type="text"
            {...register('address1')}
            error={'address1' in errors}
            helperText={errors.address1?.message}
          />
          <TextField
            required
            label="住所(番地・建物名・部屋番号)"
            type="text"
            {...register('address2')}
            error={'address2' in errors}
            helperText={errors.address2?.message}
          />
          <TextField
            required
            label={`Symbolアドレス(${SYMBOL_NETWORK_NAME})`}
            type="text"
            {...register('symbolAddress')}
            error={'symbolAddress' in errors}
            helperText={errors.symbolAddress?.message}
          />
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={handleSubmit(onSubmit)}
            disabled={!user?.emailVerified}
          >
            登録して保存
          </Button>
        </Stack>
      </Container>
      <LoadingOverlay open={loading || configLoading} />
      <ErrorDialog open={!!error} error={error} />
      <ErrorDialog open={!!configError} error={configError} />
      <ErrorDialog open={!!submitError} error={submitError} />
    </>
  );
};

export default UserCreate;
