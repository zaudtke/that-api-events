import debug from 'debug';
import favoriteStore from '../../../dataSources/cloudFirestore/favorite';
import communityStore from '../../../dataSources/cloudFirestore/community';

const dlog = debug('that:api:communities:mutation:favoriting');

export const fieldResolvers = {
  CommunityFavoritingMutation: {
    toggle: async (
      { communityId, slug },
      __,
      { dataSources: { firestore }, user },
    ) => {
      dlog('toggle community %s, for user %s', slug, user.sub);
      const fav = await favoriteStore(
        firestore,
      ).findCommunityFavoriteForMember({ communityId, user });

      let result = null;
      if (fav) {
        dlog('favorite exists, removing');
        await favoriteStore(firestore).removeFavorite(fav.id);
      } else {
        dlog(`favorite doesn't exist, adding`);
        const communityToFavorite = await communityStore(firestore).get(
          communityId,
        );
        if (communityToFavorite && communityToFavorite.status !== 'DRAFT') {
          const newFav = await favoriteStore(
            firestore,
          ).addCommunityFavoriteForMember({ communityId, user });
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
