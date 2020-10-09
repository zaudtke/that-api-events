import debug from 'debug';
import communityStore from '../../../dataSources/cloudFirestore/community';
import communityFindBy from '../../../lib/communityFindby';

const dlog = debug('that:api:communities:mutation');

export const fieldResolvers = {
  CommunitiesMutation: {
    create: (_, { community }, { dataSources: { firestore }, user }) => {
      dlog('create %s', community.slug);
      return communityStore(firestore).create({
        newCommunity: community,
        user,
      });
    },

    community: (_, { findBy }, { dataSources: { firestore } }) => {
      dlog('community called %s', findBy);
      communityFindBy(findBy, firestore);
    },

    favoriting: (_, { findBy }, { dataSources: { firestore } }) => {
      dlog('favoriting');
      communityFindBy(findBy, firestore);
    },
  },
};
