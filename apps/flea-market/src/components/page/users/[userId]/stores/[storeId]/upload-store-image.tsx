/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { api } from '../../../../../../configs/api';
import { useApi } from '../../../../../../hooks/useApi';
import LoadingOverlay from '../../../../../ui/LoadingOverlay';
import ErrorDialog from '../../../../../ui/ErrorDialog';

const UploadStoreImage = () => {
  const navigate = useNavigate();
  const { userId, storeId } = useParams();
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [config, configLoading, configError] = useApi(() => api.getConfig(), []);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!config?.enableCreateStore) {
      setError(Error('現在、店舗登録を受け付けていません。'));
      return;
    }
    const { files } = e.target;
    if (!files?.length || !userId || !storeId) {
      return;
    }
    try {
      setUploading(true);
      // uploadImage で R2 に保存し、worker が店舗レコードの画像URLも更新する。
      await api.uploadImage({ scope: 'store' }, files[0]);
      setUploading(false);
      void navigate(`/users/${userId}/stores/${storeId}`);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setUploading(false);
    }
  };

  return (
    <>
      <h2>店舗画像アップロード</h2>
      <label htmlFor="upload-button-store-image">
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-button-store-image"
          type="file"
          onChange={onChange}
        />
        <Button variant="contained" component="span">
          アップロード
        </Button>
      </label>
      <LoadingOverlay open={uploading || configLoading} />
      <ErrorDialog open={!!(error ?? configError)} error={error ?? configError} />
    </>
  );
};

export default UploadStoreImage;
