import { api } from '../../../configs/api';
import { useApi } from '../../../hooks/useApi';
import ErrorDialog from '../../ui/ErrorDialog';
import LoadingOverlay from '../../ui/LoadingOverlay';
import StoreList from '../../ui/StoreList';

const PublicStores = () => {
  const [stores, loading, error] = useApi(() => api.listStores(), []);

  return (
    <div>
      <h2>出店一覧</h2>
      <StoreList stores={stores ?? []} />
      <LoadingOverlay open={loading} />
      <ErrorDialog open={!!error} error={error} />
    </div>
  );
};

export default PublicStores;
