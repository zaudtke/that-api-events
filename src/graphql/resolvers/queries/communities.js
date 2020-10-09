import debug from 'debug';

import communityStore from '../../../dataSources/cloudFirestore/community';
import communityFindBy from '../../../lib/communityFindby';

const dlog = debug('that:api:comunities:query');

export const fieldResolvers = {
  CommunitiesQuery: {
    // Returns all communities in data store
    all: (_, __, { dataSources: { firestore } }) => {
      dlog('all called');

      return communityStore(firestore).getAllActive();
    },

    // return community with mathing id
    community: (_, { findBy }, { dataSources: { firestore } }) => {
      dlog('community top level called %s', findBy);
      return communityFindBy(findBy, firestore);
    },
  },
};
