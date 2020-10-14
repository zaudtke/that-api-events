import debug from 'debug';
import { dataSources } from '@thatconference/api';
import communityStore from '../../../dataSources/cloudFirestore/community';

const dlog = debug('that:api:community:favorites:query');
const favoriteStore = dataSources.cloudFirestore.favorites;
const favoriteType = 'community';

export const fieldResolvers = {
  CommunityFavoritesQuery: {
    ids: (_, __, { dataSources: { firestore }, user }) => {
      dlog('ids called');
      return favoriteStore(firestore)
        .getFavoritedIdsForMember({
          memberId: user.sub,
          favoriteType,
        })
        .then(d => d.map(r => r.favoritedId));
    },

    communities: async (
      _,
      { pageSize, cursor },
      { dataSources: { firestore }, user },
    ) => {
      dlog('communities called');
      const favorites = await favoriteStore(
        firestore,
      ).getFavoritedIdsForMemberPaged({
        memberId: user.sub,
        favoriteType,
        pageSize,
        cursor,
      });

      const ids = favorites.favorites.map(f => f.favoritedId);
      const communities = await communityStore(firestore).getBatch(ids);

      return {
        cursor: favorites.cursor,
        count: favorites.count,
        communities,
      };
    },
  },
};
