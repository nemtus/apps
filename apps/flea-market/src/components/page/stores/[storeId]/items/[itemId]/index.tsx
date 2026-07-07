import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { api } from '../../../../../../configs/api';
import { useApi } from '../../../../../../hooks/useApi';
import ErrorDialog from '../../../../../ui/ErrorDialog';
import LoadingOverlay from '../../../../../ui/LoadingOverlay';
import { Item } from '../../../../../ui/ItemCard';
import { Store } from '../../../../../ui/StoreCard';
import ItemCardDetail from '../../../../../ui/ItemCardDetail';

const PublicItem = () => {
  const { storeId, itemId } = useParams();
  const [store, storeLoading, storeError] = useApi(() => api.getStore(storeId ?? ''), [storeId]);
  const [item, itemLoading, itemError] = useApi(() => api.getStoreItem(storeId ?? '', itemId ?? ''), [storeId, itemId]);
  const exists = !!store && !!item;

  return (
    <Container maxWidth="sm">
      <div>
        <h2>商品詳細</h2>
        {exists ? <ItemCardDetail store={store as Store} item={item as Item} key={store.storeId} /> : null}
        <LoadingOverlay open={storeLoading || itemLoading} />
        <ErrorDialog open={!!(storeError ?? itemError)} error={storeError ?? itemError} />
      </div>
    </Container>
  );
};

export default PublicItem;
