import notificationStore from '../../../dataSources/cloudFirestore/notification';

export const fieldResolvers = {
  NotificationMutation: {
    update: async (
      { eventId, notificationId },
      { notification },
      { dataSources: { firestore } },
    ) =>
      notificationStore(firestore).update(
        eventId,
        notificationId,
        notification,
      ),
  },
};
