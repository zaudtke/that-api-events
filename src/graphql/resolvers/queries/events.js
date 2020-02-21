import debug from 'debug';

import eventStore from '../../../dataSources/cloudFirestore/event';

const dlog = debug('that:api:events:query');

export const fieldResolvers = {
  EventsQuery: {
    all: (_, __, { dataSources: { firestore, logger } }) => {
      dlog('EventsQuery.all');
      return eventStore(firestore, logger).getAll();
    },
    event: (_, { id }) => {
      dlog('EventsQuery.event');
      return { eventId: id };
    },
  },
};
