import notificationStore from '../../../dataSources/cloudFirestore/notification';

export const fieldResolvers = {
  NotificationsMutation: {
    create: async (
      { eventId },
      { notification },
      { dataSources: { firestore } },
    ) => notificationStore(firestore).create(eventId, notification),

    delete: async ({ eventId }, { id }, { dataSources: { firestore } }) =>
      notificationStore(firestore).remove(eventId, id),

    notification: ({ eventId }, { id }) => ({ eventId, notificationId: id }),
  },
};
