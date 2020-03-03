import debug from 'debug';

import venueStore from '../../../dataSources/cloudFirestore/venue';

const dlog = debug('that:api:events:query');

export const fieldResolvers = {
  VenuesQuery: {
    all: (_, __, { dataSources: { firestore } }) => {
      dlog('VenuesQuery:all');
      return venueStore(firestore).findAll();
    },

    venue: (_, { id }, { dataSources: { firestore } }) => {
      dlog('VenuesQuery:venue');
      return venueStore(firestore).find(id);
    },
  },
};
