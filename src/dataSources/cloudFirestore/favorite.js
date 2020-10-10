import debug from 'debug';
import dateForge from '../../utilities/dateForge';
import memberStore from './members';

const dlog = debug('that:api:events:datasources:firebase:favorite');

const favoriteColName = 'favorites';

const favorite = dbInstance => {
  dlog('instance created');

  const favoritesCollection = dbInstance.collection(favoriteColName);

  async function findCommunityFavoriteForMember({ communityId, user }) {
    dlog('findCommunityFavoriteForMember %s, %s', communityId, user.sub);
    const { docs } = await favoritesCollection
      .where('favoritedId', '==', communityId)
      .where('memberId', '==', user.sub)
      .where('type', '==', 'community')
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
      favoritedId: communityId,
      type: 'community',
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

  async function getCommunityFollowCount(communityId) {
    dlog('getCommunityFollowCount %s', communityId);
    const { size } = await favoritesCollection
      .where('favoritedId', '==', communityId)
      .where('type', '==', 'community')
      .select()
      .get();

    return size;
  }

  async function getCommunityFollowersPaged({ communityId, pageSize, cursor }) {
    dlog(
      'getCommunityFollowersPaged id %s, psize %d, cursor %o',
      communityId,
      pageSize,
      cursor,
    );
    const limit = Math.min(pageSize || 20, 100);
    let query = favoritesCollection
      .where('favoritedId', '==', communityId)
      .where('type', '==', 'community')
      .orderBy('createdAt')
      .limit(limit);

    if (cursor) {
      let currentCursor = Buffer.from(cursor, 'base64').toString('utf8');
      currentCursor = JSON.parse(currentCursor);
      if (!currentCursor.createdAt) throw new Error('invalid cursor provided');
      query = query.startAfter(new Date(currentCursor.createdAt));
    }
    const { docs, size } = await query.get();

    if (size === 0)
      return {
        cursor: cursor || '',
        members: [],
      };

    const followers = docs.map(f => {
      const fav = {
        id: f.id,
        ...f.data(),
      };
      return {
        memberId: fav.memberId,
        favDoc: fav,
      };
    });

    const cur = followers[followers.length - 1];
    let newCursor = {
      createdAt: dateForge(cur.favDoc.createdAt),
      pageSize,
      communityId,
    };
    newCursor = JSON.stringify(newCursor);
    newCursor = Buffer.from(newCursor, 'utf8').toString('base64');

    const allMembers = await memberStore(dbInstance).findBatch(
      followers.map(f => f.memberId),
    );

    const members = allMembers
      .filter(fm => fm && fm.canFeature && !fm.isDeactivated)
      .map(m => ({ id: m.id }));

    return {
      cursor: newCursor,
      members,
    };
  }

  return {
    findCommunityFavoriteForMember,
    addCommunityFavoriteForMember,
    removeFavorite,
    getCommunityFollowCount,
    getCommunityFollowersPaged,
  };
};

export default favorite;
