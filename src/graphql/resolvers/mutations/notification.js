import notificationStore from '../../../dataSources/cloudFirestore/notification';

const resolvers = {
  createNotification: async (
    parent,
    { eventId, notification },
    { dataSources: { firestore, logger } },
  ) => notificationStore(firestore, logger).create(eventId, notification),

  updateNotification: async (
    parent,
    { eventId, notificationId, notification },
    { dataSources: { firestore, logger } },
  ) =>
    notificationStore(firestore, logger).update(
      eventId,
      notificationId,
      notification,
    ),

  removeNotification: async (
    parent,
    { eventId, notificationId },
    { dataSources: { firestore, logger } },
  ) => notificationStore(firestore, logger).remove(eventId, notificationId),
};

export default resolvers;
