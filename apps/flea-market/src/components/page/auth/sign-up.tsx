/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Container, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useDocument } from 'react-firebase-hooks/firestore';
import db, { doc } from '../../../configs/firebase';
import { signUp } from '../../../configs/auth';
import LoadingOverlay from '../../ui/LoadingOverlay';
import ErrorDialog from '../../ui/ErrorDialog';

interface SignUpFormInput {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().required('必須です').email('メールアドレスの形式で入力してください'),
  password: yup
    .string()
    .required('必須です')
    .min(16, '16文字以上で入力してください')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&-._])[A-Za-z\d@$!%*#?&-._].*$/,
      '半角英数字記号 @$!%*#?&-._ を1文字以上含めてください',
    ),
});

const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInput>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  // フィーチャーフラグは当面 Firestore から読む（データPRで api.getConfig() へ移行）。
  const [configDoc, configDocLoading, configDocError] = useDocument(doc(db, 'configs/1'), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const onSubmit: SubmitHandler<SignUpFormInput> = async (data) => {
    if (!configDoc?.data()?.enableCreateUser) {
      setError(Error('ユーザー登録を受け付けていません。'));
      return;
    }
    setLoading(true);
    setError(undefined);
    // Better Auth は name が必須。プロフィール名は後で設定するため、ここでは email をシードする
    // （ユーザーETLの displayName ?? email フォールバックと一致）。Better Auth は sign-up 時に
    // 確認メールを送る（emailVerification.sendOnSignUp）。
    const res = await signUp.email({ email: data.email, password: data.password, name: data.email });
    setLoading(false);
    if (res.error) {
      setError(new Error(res.error.message ?? '新規登録に失敗しました。'));
      return;
    }
    if (res.data?.user?.id) {
      void navigate(`/users/${res.data.user.id}/verify-user-email`);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <h2>新規登録</h2>
        <Stack spacing={3}>
          <TextField
            required
            label="メールアドレス"
            type="email"
            {...register('email')}
            error={'email' in errors}
            helperText={errors.email?.message}
          />
          <TextField
            required
            label="パスワード"
            type="password"
            {...register('password')}
            error={'password' in errors}
            helperText={errors.password?.message}
          />
          <Button color="primary" variant="contained" size="large" onClick={handleSubmit(onSubmit)}>
            新規登録
          </Button>
          <div>
            ログインは<Link to="/auth/sign-in/">こちら</Link>
          </div>
          <div>
            <Link to="/">ホームに戻る</Link>
          </div>
        </Stack>
      </Container>
      <LoadingOverlay open={loading || configDocLoading} />
      <ErrorDialog open={!!error} error={error} />
      <ErrorDialog open={!!configDocError} error={configDocError} />
    </>
  );
};

export default SignUp;
