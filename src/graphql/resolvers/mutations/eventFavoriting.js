import debug from 'debug';
import { dataSources } from '@thatconference/api';
import eventStore from '../../../dataSources/cloudFirestore/event';

const dlog = debug('that:api:event:mutation:favoriting');
const favoriteStore = dataSources.cloudFirestore.favorites;
const favoriteType = 'event';

export const fieldResolvers = {
  EventFavoritingMutation: {
    toggle: async ({ eventId }, __, { dataSources: { firestore }, user }) => {
      dlog('toggle event %s, for user %s', eventId, user.sub);
      const fav = await favoriteStore(firestore).findFavoriteForMember({
        favoritedId: eventId,
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
        const eventToFavorite = await eventStore(firestore).get(eventId);

        if (eventToFavorite && eventToFavorite.isActive) {
          const newFav = await favoriteStore(firestore).addFavoriteForMember({
            favoritedId: eventId,
            favoriteType,
            user,
          });
          if (!newFav.id)
            throw new Error(
              `New favorite on ${eventId} for member ${user.id} failed to create`,
            );
          result = eventToFavorite;
        }
      }

      return result;
    },
  },
};
