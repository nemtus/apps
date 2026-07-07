/* eslint-disable @typescript-eslint/no-misused-promises */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Container, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { resetPassword } from '../../../configs/auth';
import LoadingOverlay from '../../ui/LoadingOverlay';
import ErrorDialog from '../../ui/ErrorDialog';

interface ResetPasswordFormInput {
  password: string;
}

const schema = yup.object({
  password: yup
    .string()
    .required('必須です')
    .min(16, '16文字以上で入力してください')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&-._])[A-Za-z\d@$!%*#?&-._].*$/,
      '半角英数字記号 @$!%*#?&-._ を1文字以上含めてください',
    ),
});

// Landing page for the password-reset email link (`/auth/reset-password/?token=...`).
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInput>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [success, setSuccess] = useState<boolean>(false);

  const onSubmit: SubmitHandler<ResetPasswordFormInput> = async (data) => {
    if (!token) {
      setError(new Error('リセットリンクが無効です。もう一度パスワードリセットをお試しください。'));
      return;
    }
    setLoading(true);
    setError(undefined);
    const res = await resetPassword({ newPassword: data.password, token });
    setLoading(false);
    if (res.error) {
      setError(new Error(res.error.message ?? 'パスワードの再設定に失敗しました。'));
      return;
    }
    setSuccess(true);
  };

  return (
    <>
      <Container maxWidth="sm">
        <h2>パスワード再設定</h2>
        <Stack spacing={3}>
          <TextField
            required
            label="新しいパスワード"
            type="password"
            {...register('password')}
            error={'password' in errors}
            helperText={errors.password?.message}
          />
          <Button color="primary" variant="contained" size="large" onClick={handleSubmit(onSubmit)} disabled={success}>
            パスワードを再設定
          </Button>
          {success ? (
            <div>
              パスワードを再設定しました。<Link to="/auth/sign-in/">ログイン</Link>してください。
            </div>
          ) : (
            ''
          )}
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

export default ResetPassword;
