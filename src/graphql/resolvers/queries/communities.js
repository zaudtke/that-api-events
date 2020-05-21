import debug from 'debug';

import communityStore from '../../../dataSources/cloudFirestore/commumity';

const dlog = debug('that:api:comunities:query');

export const fieldResolvers = {
  CommunitiesQuery: {
    active: ({ name }, __, { dataSources: { firestore } }) => {
      dlog('active');
      return communityStore(firestore).findActiveEvents(name);
    },
    all: ({ name }, __, { dataSources: { firestore } }) => {
      dlog('all');
      return communityStore(firestore).findAllEvents(name);
    },
  },
};
