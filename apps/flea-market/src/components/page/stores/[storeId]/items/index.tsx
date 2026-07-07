import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { api } from '../../../../../configs/api';
import { useApi } from '../../../../../hooks/useApi';
import ErrorDialog from '../../../../ui/ErrorDialog';
import LoadingOverlay from '../../../../ui/LoadingOverlay';
import ItemList from '../../../../ui/ItemList';
import { Store } from '../../../../ui/StoreCard';
import { Item } from '../../../../ui/ItemCard';

const PublicItems = () => {
  const { storeId } = useParams();
  const [store, storeLoading, storeError] = useApi(() => api.getStore(storeId ?? ''), [storeId]);
  const [items, itemsLoading, itemsError] = useApi(() => api.listStoreItems(storeId ?? ''), [storeId]);
  const itemsExist = !!store && !!items?.length;

  return (
    <Container maxWidth="sm">
      <div>
        <h2>商品一覧</h2>
        {itemsExist ? <ItemList store={store as Store} items={items as Item[]} /> : null}
        <LoadingOverlay open={storeLoading || itemsLoading} />
        <ErrorDialog open={!!(storeError ?? itemsError)} error={storeError ?? itemsError} />
      </div>
    </Container>
  );
};

export default PublicItems;
