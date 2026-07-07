/* eslint-disable @typescript-eslint/no-misused-promises */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Container, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { changePassword } from '../../../configs/auth';
import { useAuthUser } from '../../../hooks/useAuthUser';
import LoadingOverlay from '../../ui/LoadingOverlay';
import ErrorDialog from '../../ui/ErrorDialog';

interface PasswordUpdateFormInput {
  currentPassword: string;
  password: string;
}

const schema = yup.object({
  currentPassword: yup.string().required('必須です'),
  password: yup
    .string()
    .required('必須です')
    .min(16, '16文字以上で入力してください')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&-._])[A-Za-z\d@$!%*#?&-._].*$/,
      '半角英数字記号 @$!%*#?&-._ を1文字以上含めてください',
    ),
});

const PasswordUpdate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordUpdateFormInput>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  const navigate = useNavigate();
  const [user, loadingUser, errorUser] = useAuthUser();
  const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (errorUser) {
      void navigate('/auth/sign-in/');
      return;
    }
    if (!user && !loadingUser) {
      void navigate('/auth/sign-in/');
    }
  });

  const onSubmit: SubmitHandler<PasswordUpdateFormInput> = async (data) => {
    setLoading(true);
    setError(undefined);
    const res = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.password,
      revokeOtherSessions: true,
    });
    setLoading(false);
    if (res.error) {
      setError(new Error(res.error.message ?? 'パスワードの変更に失敗しました。'));
      return;
    }
    setUpdatePasswordSuccess(true);
  };

  return (
    <>
      <Container maxWidth="sm">
        <h2>パスワード変更</h2>
        <Stack spacing={3}>
          <TextField
            required
            label="現在のパスワード"
            type="password"
            {...register('currentPassword')}
            error={'currentPassword' in errors}
            helperText={errors.currentPassword?.message}
          />
          <TextField
            required
            label="新しいパスワード"
            type="password"
            {...register('password')}
            error={'password' in errors}
            helperText={errors.password?.message}
          />
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={handleSubmit(onSubmit)}
            disabled={updatePasswordSuccess && !error}
          >
            パスワード変更
          </Button>
          {updatePasswordSuccess && !error ? <div>パスワードが変更されました。</div> : ''}
          <div>
            新規登録は<Link to="/auth/sign-up/">こちら</Link>
          </div>
          <div>
            ログインは<Link to="/auth/sign-in/">こちら</Link>
          </div>
          <div>
            <Link to="/">ホームに戻る</Link>
          </div>
        </Stack>
      </Container>
      <LoadingOverlay open={loading} />
      <ErrorDialog open={!!error} error={error} />
    </>
  );
};

export default PasswordUpdate;
