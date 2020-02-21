import debug from 'debug';

import venueStore from '../../../dataSources/cloudFirestore/venue';

const dlog = debug('that:api:events:query');

export const fieldResolvers = {
  VenuesQuery: {
    all: (_, __, { dataSources: { firestore, logger } }) => {
      dlog('VenuesQuery:all');
      return venueStore(firestore, logger).findAll();
    },

    venue: (_, { id }, { dataSources: { firestore, logger } }) => {
      dlog('VenuesQuery:venue');
      return venueStore(firestore, logger).find(id);
    },
  },
};
