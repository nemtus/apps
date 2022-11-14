import { CloudFunction } from 'firebase-functions';
import { exportFunction } from '../../../utils/firebase/deploy';
import { hello } from './hello';

const _exportFunction = (name: string, f: () => CloudFunction<unknown>) =>
  exportFunction(['v1', 'pubsub', 'schedule', name], exports, f);

_exportFunction('hello', hello);
