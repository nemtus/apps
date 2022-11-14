import baseFunctions from '../../../utils/firebase/baseFunction';
import { logger } from '../../../utils/firebase/logger';

export const hello = () =>
  baseFunctions().https.onRequest((request, response) => {
    logger.debug({ request });
    logger.debug('Hello logs!');
    logger.debug({ response });
    response.send('Hello from Firebase!');
  });
