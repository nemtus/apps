/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button, Container, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

// 店舗電話番号の確認は当面スキップ（env ENABLE_STORE_PHONE_VERIFICATION が既定 off）。
// Twilio 等の連携が整い次第、チャレンジ実装を追加してフラグで有効化する。
const VerifyStorePhoneNumber = () => {
  const { userId, storeId } = useParams();
  const navigate = useNavigate();
  const handleBack = () => {
    void navigate(`/users/${userId ?? ''}/stores/${storeId ?? ''}/`);
  };
  return (
    <Container maxWidth="sm">
      <h2>店舗電話番号確認</h2>
      <Stack spacing={3}>
        <Typography>
          店舗電話番号の確認は現在準備中です。店舗KYCはメールアドレスの確認のみで完了します（電話番号の確認は連携準備が整い次第ご案内します）。
        </Typography>
        <Button color="primary" variant="contained" size="large" onClick={handleBack}>
          店舗ページに戻る
        </Button>
      </Stack>
    </Container>
  );
};

export default VerifyStorePhoneNumber;
