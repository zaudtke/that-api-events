/* eslint-disable import/prefer-default-export */
import debug from 'debug';

import notificationResolver from './notification';
import venueStore from '../../../dataSources/cloudFirestore/venue';
import eventStore from '../../../dataSources/cloudFirestore/event';
import partnerStore from '../../../dataSources/cloudFirestore/partner';

const dlog = debug('that:api:events:query');

export const fieldResolvers = {
  EventQuery: {
    get: async ({ eventId }, _, { dataSources: { firestore, logger } }) => {
      dlog('EventQuery.event');
      return eventStore(firestore, logger).get(eventId);
    },
  },
  Event: {
    notifications: notificationResolver.notifications,
    venues: async (
      { venues },
      args,
      { dataSources: { firestore, logger } },
    ) => {
      dlog('Event:venues');
      return venueStore(firestore, logger).findByIds(venues);
    },
    partners: ({ id }, args, { dataSources: { firestore } }) => {
      dlog('partners %s', id);

      return partnerStore(firestore)
        .findAll(id)
        .then(r =>
          r.map(item => ({
            ...item,
            __typename: 'Partner',
          })),
        );
    },
    sessions: (_, __, { dataSources: { firestore } }) => {
      dlog('Event:sessions ref');
      return [];
    },
  },
};
