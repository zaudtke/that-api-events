import eventStore from '../../../dataSources/cloudFirestore/event';

const resolvers = {
  createEvent: async (
    parent,
    { event },
    { dataSources: { firestore, logger } },
  ) => eventStore(firestore, logger).create(event),

  updateEvent: async (
    parent,
    { id, event },
    { dataSources: { firestore, logger } },
  ) => eventStore(firestore, logger).update(id, event),
};

export default resolvers;
