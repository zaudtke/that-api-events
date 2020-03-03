import eventStore from '../../../dataSources/cloudFirestore/event';

export const fieldResolvers = {
  EventsMutation: {
    create: async (parent, { event }, { dataSources: { firestore } }) =>
      eventStore(firestore).create(event),

    delete: (parent, { id }, { dataSources: { firestore } }) => {
      throw new Error('Not Implemented yet.');
    },

    event: (_, { id }) => ({ eventId: id }),
  },
};
