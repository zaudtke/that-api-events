/* eslint-disable import/prefer-default-export */
import debug from 'debug';

import notificationResolver from './notification';
import venueStore from '../../../dataSources/cloudFirestore/venue';

const dlog = debug('that-api-events:query');

export const fieldResolvers = {
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
    partners: (parent, args, { dataSources: { firestore, logger } }) => {
      dlog('Event:partner ref');
      return [
        {
          __typename: 'Partner',
          id: 'v4WmCWU1LVzWsoJnenxC',
        },
        {
          __typename: 'Partner',
          id: 'wPA6h12zXHt5q8240bCg',
        },
      ];
    },
    sessions: (parent, args, { dataSources: { firestore, logger } }) => {
      dlog('Event:sessions ref');
      // todo: need to resolve the
      return [];
    },
  },
};
