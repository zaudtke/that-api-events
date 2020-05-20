import debug from 'debug';

import eventStore from '../../../dataSources/cloudFirestore/event';

const dlog = debug('that:api:events:query');

export const fieldResolvers = {
  EventsQuery: {
    all: (_, __, { dataSources: { firestore } }) => {
      dlog('EventsQuery.all');
      return eventStore(firestore).getAll();
    },
    event: (_, { id }) => {
      dlog('EventsQuery.event');
      return { eventId: id };
    },
    eventBySlug: (_, { slug }, { dataSources: { firestore } }) => {
      dlog('eventBySlug');
      return eventStore(firestore).findBySlug(slug);
    },
  },
};
