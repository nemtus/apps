/* eslint-disable @typescript-eslint/no-misused-promises */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { api } from '../../../../../../configs/api';
import { useAuthUser } from '../../../../../../hooks/useAuthUser';
import LoadingOverlay from '../../../../../ui/LoadingOverlay';
import ErrorDialog from '../../../../../ui/ErrorDialog';

interface VerifyStoreEmailFormInput {
  storeEmailSecret: string;
}

const schema = yup.object({
  storeEmailSecret: yup
    .string()
    .required('必須です')
    .matches(/^[0-9]{6}$/, '数字6桁で入力してください'),
});

const VerifyStoreEmail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyStoreEmailFormInput>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  const { userId, storeId } = useParams();
  const navigate = useNavigate();
  const [user, loadingUser, errorUser] = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (loadingUser) {
      return;
    }
    if (!(user && userId && userId === user.uid)) {
      void navigate('/auth/sign-in/');
      return;
    }
    if (userId !== storeId) {
      void navigate(`/users/${userId}`);
    }
  }, [user, loadingUser, userId, storeId, navigate]);

  const handleSendCode = () => {
    setLoading(true);
    setError(undefined);
    // worker が店舗メール宛に確認コードを SES で送信する。
    api
      .requestStoreEmailVerification()
      .then(() => {
        setSent(true);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit: SubmitHandler<VerifyStoreEmailFormInput> = (data) => {
    setLoading(true);
    setError(undefined);
    api
      .verifyStoreEmail(data.storeEmailSecret)
      .then(() => {
        void navigate(`/users/${userId}/stores/${storeId}/`);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancel = () => {
    void navigate(`/users/${userId ?? ''}/stores/${storeId ?? ''}/`);
  };

  return (
    <>
      <Container maxWidth="sm">
        <h2>店舗メールアドレス確認</h2>
        <Stack spacing={3}>
          <Typography>
            登録した店舗メールアドレス宛に確認コードを送信し、届いた6桁のコードを入力してください。
          </Typography>
          <Button color="secondary" variant="outlined" size="large" onClick={handleSendCode}>
            確認コードを送信
          </Button>
          {sent ? <Typography color="success.main">確認コードを送信しました。</Typography> : null}
          <TextField
            required
            label="確認コード"
            type="text"
            {...register('storeEmailSecret')}
            error={'storeEmailSecret' in errors}
            helperText={errors.storeEmailSecret?.message}
          />
          <Button color="primary" variant="contained" size="large" onClick={handleSubmit(onSubmit)}>
            確認
          </Button>
          <Button color="primary" variant="contained" size="large" onClick={handleCancel}>
            キャンセル
          </Button>
        </Stack>
      </Container>
      <LoadingOverlay open={loadingUser || loading} />
      <ErrorDialog open={!!errorUser} error={errorUser} />
      <ErrorDialog open={!!error} error={error} />
    </>
  );
};

export default VerifyStoreEmail;
