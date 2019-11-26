import notificationStore from '../../../dataSources/cloudFirestore/notification';

const resolvers = {
  notifications: async (
    parent,
    { eventId },
    { dataSources: { firestore, logger } },
  ) => {
    const id = eventId || parent.id;

    return notificationStore(firestore, logger).findAll(id);
  },
};

export default resolvers;
