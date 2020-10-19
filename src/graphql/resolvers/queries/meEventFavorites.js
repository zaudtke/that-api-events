import debug from 'debug';
import { dataSources } from '@thatconference/api';
import eventStore from '../../../dataSources/cloudFirestore/event';

const dlog = debug('that:api:event:favorites:query');
const favoriteStore = dataSources.cloudFirestore.favorites;
const favoriteType = 'event';

export const fieldResolvers = {
  MeEventFavoritesQuery: {
    ids: (_, __, { dataSources: { firestore }, user }) => {
      dlog('ids called');
      return favoriteStore(firestore)
        .getFavoritedIdsForMember({
          memberId: user.sub,
          favoriteType,
        })
        .then(d => d.map(r => r.favoritedId));
    },

    events: async (
      _,
      { pageSize, cursor },
      { dataSources: { firestore }, user },
    ) => {
      dlog('events called');
      const favorites = await favoriteStore(
        firestore,
      ).getFavoritedIdsForMemberPaged({
        memberId: user.sub,
        favoriteType,
        pageSize,
        cursor,
      });

      const ids = favorites.favorites.map(f => f.favoritedId);
      const events = await eventStore(firestore).getBatch(ids);

      return {
        cursor: favorites.cursor,
        count: favorites.count,
        events,
      };
    },
  },
};
