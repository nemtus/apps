import { Button, Container, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { sendVerificationEmail } from '../../../../configs/auth';
import { api } from '../../../../configs/api';
import { useApi } from '../../../../hooks/useApi';
import { useAuthUser } from '../../../../hooks/useAuthUser';
import LoadingOverlay from '../../../ui/LoadingOverlay';
import ErrorDialog from '../../../ui/ErrorDialog';

const VerifyUserEmail = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, loading, error] = useAuthUser();
  const [me, meLoading] = useApi(() => api.getMe().catch(() => undefined), [user?.uid]);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<Error | undefined>(undefined);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!(user && userId && userId === user.uid)) {
      void navigate('/auth/sign-in/');
      return;
    }
    // Better Auth のメール確認が済んでいれば先へ。プロフィール未作成なら作成ページへ。
    if (user.emailVerified) {
      void navigate(me?.name ? `/users/${userId}` : `/users/${userId}/create`);
    }
  }, [user, loading, userId, me, navigate]);

  const handleResend = () => {
    if (!user?.email) {
      return;
    }
    setActionLoading(true);
    setActionError(undefined);
    // Better Auth が SES 経由で確認メールを再送する。
    sendVerificationEmail({
      email: user.email,
      callbackURL: `${window.location.origin}/users/${user.uid}/verify-user-email`,
    })
      .then((res) => {
        if (res.error) {
          setActionError(new Error(res.error.message ?? '認証メールの再送に失敗しました。'));
          return;
        }
        setResent(true);
      })
      .catch((e: unknown) => {
        setActionError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  const handleCheck = () => {
    // セッションを取り直して emailVerified を反映する。
    window.location.reload();
  };

  return (
    <>
      <Container maxWidth="sm">
        <h2>メールアドレス確認</h2>
        <Stack spacing={3}>
          <Typography>
            ご登録のメールアドレス宛に届いている認証メールのリンクをクリックしてください。クリック後、「確認」を押すと次へ進めます。
          </Typography>
          {resent ? <Typography color="success.main">認証メールを再送しました。</Typography> : null}
          <Button color="primary" variant="contained" size="large" onClick={handleCheck}>
            確認
          </Button>
          <Button color="secondary" variant="outlined" size="large" onClick={handleResend}>
            認証メールを再送
          </Button>
        </Stack>
      </Container>
      <LoadingOverlay open={loading || meLoading || actionLoading} />
      <ErrorDialog open={!!error} error={error} />
      <ErrorDialog open={!!actionError} error={actionError} />
    </>
  );
};

export default VerifyUserEmail;
