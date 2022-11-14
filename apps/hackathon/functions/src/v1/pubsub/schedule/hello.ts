import { logger } from '../../../utils/firebase/logger';
import functions from '../../../utils/firebase/baseFunction';

export const hello = () =>
  functions()
    .pubsub.schedule('* * * * *')
    .onRun((context) => {
      logger.debug({ context });
      logger.debug('Hello logs from pubsub!');
    });
