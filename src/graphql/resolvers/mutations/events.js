import debug from 'debug';
import eventStore from '../../../dataSources/cloudFirestore/event';
import eventFindBy from '../../../lib/eventFindBy';

const dlog = debug('that:api:events:mutations');

export const fieldResolvers = {
  EventsMutation: {
    create: async (parent, { event }, { dataSources: { firestore } }) =>
      eventStore(firestore).create(event),

    event: (_, { id }) => ({ eventId: id }),

    favoriting: (_, { findBy }, { dataSources: { firestore } }) => {
      dlog('favoriting %o', findBy);
      return eventFindBy(findBy, firestore);
    },
  },
};
