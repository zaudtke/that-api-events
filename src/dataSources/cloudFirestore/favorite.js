import debug from 'debug';

const dlog = debug('that:api:events:datasources:firebase:favorite');

const favoriteColName = 'favorites';

const favorite = dbInstance => {
  dlog('instance created');

  const favoritesCollection = dbInstance.collection(favoriteColName);

  async function findCommunityFavoriteForMember({ communityId, user }) {
    dlog('findCommunityFavoriteForMember %s, %s', communityId, user.sub);
    const { docs } = await favoritesCollection
      .where('favoritedId.communityId', '==', communityId)
      .where('memberId', '==', user.sub)
      .select()
      .get();

    if (docs.length > 1) {
      throw new Error(
        'Community %s favorited multiple times by member %s',
        communityId,
        user.sub,
      );
    }

    return docs.map(f => ({ id: f.id }));
  }

  return { findCommunityFavoriteForMember };
};

export default favorite;
