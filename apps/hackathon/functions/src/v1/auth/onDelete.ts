import functions from '../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../utils/firebase/logger';

export const onDelete = () =>
  functions()
    .auth.user()
    .onDelete(async (userRecord, context) => {
      if (await hasAlreadyTriggered(context.eventId, 'v1-auth-onDelete')) {
        return;
      }
      logger.debug({
        userRecord,
        context,
      });
    });
