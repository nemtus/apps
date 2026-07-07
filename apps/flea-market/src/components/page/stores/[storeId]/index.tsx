import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { api } from '../../../../configs/api';
import { useApi } from '../../../../hooks/useApi';
import ErrorDialog from '../../../ui/ErrorDialog';
import LoadingOverlay from '../../../ui/LoadingOverlay';
import StoreCardDetail from '../../../ui/StoreCardDetail';
import { Store } from '../../../ui/StoreCard';
import PublicItems from './items';

const PublicStore = () => {
  const { storeId } = useParams();
  const [store, loading, error] = useApi(() => api.getStore(storeId ?? ''), [storeId]);

  return (
    <Container maxWidth="sm">
      <div>
        <h2>店舗詳細</h2>
        {store ? (
          <>
            <StoreCardDetail store={store as Store} key={store.storeId} />
            <PublicItems />
          </>
        ) : null}
        <LoadingOverlay open={loading} />
        <ErrorDialog open={!!error} error={error} />
      </div>
    </Container>
  );
};

export default PublicStore;
