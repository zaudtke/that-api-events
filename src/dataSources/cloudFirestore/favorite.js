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

    let result = null;
    const [f] = docs;
    if (f) result = { id: f.id };

    return result;
  }

  async function addCommunityFavoriteForMember({ communityId, user }) {
    dlog('add favorite of %s for member %s', communityId, user.sub);
    const newFavorite = {
      memberId: user.sub,
      favoritedId: {
        communityId,
      },
      createdAt: new Date(),
    };
    const newDoc = await favoritesCollection.add(newFavorite);

    return {
      id: newDoc.id,
      ...newFavorite,
    };
  }

  function removeFavorite(favoriteId) {
    dlog('remove favorite %s', favoriteId);
    return favoritesCollection.doc(favoriteId).delete();
  }

  return {
    findCommunityFavoriteForMember,
    addCommunityFavoriteForMember,
    removeFavorite,
  };
};

export default favorite;
