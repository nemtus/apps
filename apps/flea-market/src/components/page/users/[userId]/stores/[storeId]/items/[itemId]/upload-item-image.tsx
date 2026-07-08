/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { api } from '../../../../../../../../configs/api';
import { useApi } from '../../../../../../../../hooks/useApi';
import LoadingOverlay from '../../../../../../../ui/LoadingOverlay';
import ErrorDialog from '../../../../../../../ui/ErrorDialog';

const UploadItemImage = () => {
  const navigate = useNavigate();
  const { userId, storeId, itemId } = useParams();
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [config, configLoading, configError] = useApi(() => api.getConfig(), []);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!config?.enableCreateItem) {
      setError(Error('現在、商品登録を受け付けていません。'));
      return;
    }
    const { files } = e.target;
    if (!files?.length || !userId || !storeId || !itemId) {
      return;
    }
    try {
      setUploading(true);
      // uploadImage で R2 に保存し、worker が商品レコードの画像URLも更新する。
      await api.uploadImage({ scope: 'item', itemId }, files[0]);
      setUploading(false);
      void navigate(`/users/${userId}/stores/${storeId}/items/${itemId}`);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setUploading(false);
    }
  };

  return (
    <>
      <h2>商品画像アップロード</h2>
      <label htmlFor="upload-button-item-image">
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-button-item-image"
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

export default UploadItemImage;
