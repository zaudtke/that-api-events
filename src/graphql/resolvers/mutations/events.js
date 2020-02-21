import eventStore from '../../../dataSources/cloudFirestore/event';

export const fieldResolvers = {
  EventsMutation: {
    create: async (
      parent,
      { event },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('EventsMutation:create called.');
      return eventStore(firestore, logger).create(event);
    },

    delete: (parent, { id }, { dataSources: { firestore, logger } }) => {
      logger.debug('EventsMutation:delete called.');
      throw new Error('Not Implemented yet.');
    },

    event: (_, { id }) => ({ eventId: id }),
  },
};
