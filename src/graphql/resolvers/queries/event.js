import debug from 'debug';

import notificationResolver from './notification';
import venueStore from '../../../dataSources/cloudFirestore/venue';
import eventStore from '../../../dataSources/cloudFirestore/event';
import partnerStore from '../../../dataSources/cloudFirestore/partner';
import sessionStore from '../../../dataSources/cloudFirestore/session';

const dlog = debug('that:api:events:query');

export const fieldResolvers = {
  EventQuery: {
    get: ({ eventId }, _, { dataSources: { firestore, logger } }) => {
      dlog('EventQuery.get');
      return eventStore(firestore, logger).get(eventId);
    },
    partners: ({ eventId }) => {
      dlog('EventQuery.partners');
      return { eventId };
    },
  },
  Event: {
    notifications: notificationResolver.notifications,
    venues: ({ venues }, args, { dataSources: { firestore, logger } }) => {
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
    sessions: ({ id }, __, { dataSources: { firestore, logger } }) => {
      dlog('sessions');

      return sessionStore(firestore, logger).findAllApprovedByEventId(id);
    },
  },
};
