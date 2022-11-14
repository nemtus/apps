import functions from '../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../utils/firebase/logger';

export const onCreate = () =>
  functions()
    .auth.user()
    .onCreate(async (userRecord, context) => {
      if (await hasAlreadyTriggered(context.eventId, 'v1-auth-onCreate')) {
        return;
      }
      logger.debug({
        userRecord,
        context,
      });
    });
