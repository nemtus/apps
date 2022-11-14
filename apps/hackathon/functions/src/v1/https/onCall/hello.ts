import baseFunctions from '../../../utils/firebase/baseFunction';
import { logger } from '../../../utils/firebase/logger';

export const hello = () =>
  baseFunctions().https.onCall(async (data, context) => {
    logger.debug({ data, context });
    const response = {
      message: 'Hello from Firebase functions https onCall!',
    };
    return response;
  });
