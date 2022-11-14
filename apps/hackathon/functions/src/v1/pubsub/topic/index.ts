import { CloudFunction } from 'firebase-functions';
import { Message } from 'firebase-functions/v1/pubsub';
import { exportFunction } from '../../../utils/firebase/deploy';
import { hello } from './hello';

const _exportFunction = (name: string, f: () => CloudFunction<Message>) =>
  exportFunction(['v1', 'pubsub', 'topic', name], exports, f);

_exportFunction('hello', hello);
