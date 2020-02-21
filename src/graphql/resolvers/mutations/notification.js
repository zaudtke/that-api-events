import notificationStore from '../../../dataSources/cloudFirestore/notification';

export const fieldResolvers = {
  NotificationMutation: {
    update: async (
      { eventId, notificationId },
      { notification },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('NotificationMutation.update called.');
      return notificationStore(firestore, logger).update(
        eventId,
        notificationId,
        notification,
      );
    },
  },
};
