import debug from 'debug';
import eventStore from '../../../dataSources/cloudFirestore/event';

const dlog = debug('that:api:events:mutations');

export const fieldResolvers = {
  EventsMutation: {
    create: async (parent, { event }, { dataSources: { firestore } }) =>
      eventStore(firestore).create(event),

    delete: (parent, { id }, { dataSources: { firestore } }) => {
      throw new Error('Not Implemented yet.');
    },

    event: (_, { id }) => ({ eventId: id }),

    favoriting: (_, { id }, { dataSources: { firestore } }) => {
      dlog('favoriting %s', id);
      return { eventId: id };
    },
  },
};
