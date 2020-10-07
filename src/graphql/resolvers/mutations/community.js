import debug from 'debug';
import communityStore from '../../../dataSources/cloudFirestore/community';

const dlog = debug('that:api:community:mutation');

export const fieldResolvers = {
  CommunityMutation: {
    update: (
      { communityId },
      { community },
      { dataSources: { firestore }, user },
    ) => {
      dlog('update community');
      return communityStore(firestore).update({
        communityId,
        modifiedCommunity: community,
        user,
      });
    },
  },
};
