import debug from 'debug';
import { dataSources } from '@thatconference/api';
import communityStore from '../../../dataSources/cloudFirestore/community';

const dlog = debug('that:api:communities:mutation:favoriting');
const favoriteStore = dataSources.cloudFirestore.favorites;
const favoriteType = 'community';

export const fieldResolvers = {
  CommunityFavoritingMutation: {
    toggle: async (
      { communityId, slug },
      __,
      { dataSources: { firestore }, user },
    ) => {
      dlog('toggle community %s, for user %s', slug, user.sub);
      const fav = await favoriteStore(firestore).findFavoriteForMember({
        favoritedId: communityId,
        favoriteType,
        user,
      });

      let result = null;
      if (fav) {
        dlog('favorite exists, removing');
        await favoriteStore(firestore).removeFavorite({
          favoriteId: fav.id,
          user,
        });
      } else {
        dlog(`favorite doesn't exist, adding`);
        const communityToFavorite = await communityStore(firestore).get(
          communityId,
        );
        if (communityToFavorite && communityToFavorite.status !== 'DRAFT') {
          const newFav = await favoriteStore(firestore).addFavoriteForMember({
            favoritedId: communityId,
            favoriteType,
            user,
          });
          if (!newFav.id)
            throw new Error(
              `New favorite on ${communityId} for member ${user.id} failed to create`,
            );
          result = communityToFavorite;
        }
      }

      return result;
    },
  },
};
