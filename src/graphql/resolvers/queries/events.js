/* eslint-disable import/prefer-default-export */
import debug from 'debug';

import eventStore from '../../../dataSources/cloudFirestore/event';

const dlog = debug('that:api:events:query');

export const fieldResolvers = {
  EventsQuery: {
    all: async (parent, args, { dataSources: { firestore, logger } }) => {
      dlog('EventsQuery.all');
      return eventStore(firestore, logger).getAll();
    },
    event: async (parent, { id }, { dataSources: { firestore, logger } }) => {
      dlog('EventsQuery.event');
      return { eventId: id };
    },
  },
};
