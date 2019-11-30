import notificationStore from '../../../dataSources/cloudFirestore/notification';

/* eslint-disable import/prefer-default-export */
import eventStore from '../../../dataSources/cloudFirestore/event';

export const fieldResolvers = {
  NotificationMutation: {
    notification: async (
      parent,
      { eventId, notificationId, notification },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('NotificationMutation.notification called.');
      return eventStore(firestore, logger).update(
        eventId,
        notificationId,
        notification,
      );
    },
  },
};
