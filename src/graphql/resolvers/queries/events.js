import debug from 'debug';

import eventStore from '../../../dataSources/cloudFirestore/event';

const dlog = debug('that:api:events:query');

export const fieldResolvers = {
  EventsQuery: {
    all: (_, { type }, { dataSources: { firestore } }) => {
      dlog('EventsQuery.all', type);
      // return eventStore(firestore).getAll();
      let dataSource;
      if (type) {
        dlog('by event type');
        dataSource = eventStore(firestore).getAllByType(type);
      } else {
        dlog('all events');
        dataSource = eventStore(firestore).getAll();
      }

      return dataSource;
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
