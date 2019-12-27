/* eslint-disable import/prefer-default-export */
import debug from 'debug';

import venueStore from '../../../dataSources/cloudFirestore/venue';

const dlog = debug('that:api:events:query');

export const fieldResolvers = {
  VenuesQuery: {
    all: async (parent, args, { dataSources: { firestore, logger } }) => {
      dlog('VenuesQuery:all');
      return venueStore(firestore, logger).findAll();
    },

    venue: async (parent, { id }, { dataSources: { firestore, logger } }) => {
      dlog('VenuesQuery:venue');
      return venueStore(firestore, logger).find(id);
    },
  },
};
