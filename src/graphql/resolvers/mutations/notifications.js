/* eslint-disable import/prefer-default-export */
import eventStore from '../../../dataSources/cloudFirestore/event';

export const fieldResolvers = {
  NotificationsMutation: {
    create: async (
      parent,
      { eventId, notification },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('NotificationsMutation.create called.');
      return eventStore(firestore, logger).create(eventId, notification);
    },

    delete: async (
      parent,
      { eventId, notificationId },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('NotificationsMutation.delete called.');

      return eventStore(firestore, logger).remove(eventId, notificationId);
    },

    update: () => ({}),
  },
};
