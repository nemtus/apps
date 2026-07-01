import { logger } from '../../../utils/firebase/logger';
import functions from '../../../utils/firebase/baseFunction';

export const hello = () =>
  functions()
    .pubsub.topic('hello')
    .onPublish((message, context) => {
      logger.debug({ message, context });
      logger.debug('Hello logs from pubsub topic!');
    });
