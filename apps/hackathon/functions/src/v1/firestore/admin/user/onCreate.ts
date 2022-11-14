import functions from '../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../utils/firebase/logger';

const path = '/v/1/scopes/admin/users/{userID}';

export const onCreate = () =>
  functions()
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-admin-user-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });
    });
