/* eslint-disable import/prefer-default-export */
import notificationStore from '../../../dataSources/cloudFirestore/notification';

export const fieldResolvers = {
  NotificationsMutation: {
    create: async (
      { eventId },
      { notification },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('NotificationsMutation.create called.');

      return notificationStore(firestore, logger).create(eventId, notification);
    },

    delete: async (
      { eventId },
      { id },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('NotificationsMutation.delete called.');

      return notificationStore(firestore, logger).remove(eventId, id);
    },

    notification: ({ eventId }, { id }) => ({ eventId, notificationId: id }),
  },
};
