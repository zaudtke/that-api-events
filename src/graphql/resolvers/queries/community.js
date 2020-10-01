import debug from 'debug';

import communityStore from '../../../dataSources/cloudFirestore/community';
import eventStore from '../../../dataSources/cloudFirestore/event';
import sessionStore from '../../../dataSources/cloudFirestore/session';

const dlog = debug('that:api:community:query');

export const fieldResolvers = {
  CommunityQuery: {
    get: ({ communityId }, __, { dataSources: { firestore } }) => {
      dlog('get called %s', communityId);

      if (!communityId) return null;

      return communityStore(firestore).get(communityId);
    },

    stats: ({ communityId }, __, { dataSources: { firestore } }) => {
      dlog('stats called %s', communityId);
      if (!communityId) return null;
      throw new Error('Not implemented yet');
    },
  },
  Community: {
    createdBy: ({ createdBy }) => {
      dlog('createdBy');
      return {
        __typename: 'PublicProfile',
        id: createdBy,
      };
    },
    lastUpdatedBy: ({ lastUpdatedBy }) => {
      dlog('lastUpdatedBy');
      return {
        __typename: 'PublicProile',
        id: lastUpdatedBy,
      };
    },
    events: ({ slug }, { filter }, { dataSources: { firestore } }) => {
      dlog('Community.events called with filter %s', filter);

      let eventResults;
      if (filter === 'ACTIVE') {
        eventResults = eventStore(firestore).findActiveByCommunitySlug(slug);
      } else if (filter === 'FEATURED') {
        eventResults = eventStore(firestore).findFeaturedByCommunitySlug(slug);
      } else if (filter === 'PAST') {
        eventResults = eventStore(firestore).findPastByCommunitySlug(slug);
      } else if (!filter || filter === 'ALL') {
        eventResults = eventStore(firestore).findAllByCommunitySlug(slug);
      } else {
        throw new Error(`fiter ${filter} not implemented yet.`);
      }

      return eventResults;
    },

    sessions: async (
      { slug },
      {
        status = ['APPROVED'],
        orderBy = 'START_TIME_ASC',
        pageSize = 20,
        startAfter,
      },
      { dataSources: { firestore } },
    ) => {
      dlog(
        'sessions called: community %s, page size %d, after %s, orderedBy %s, having statuses %o',
        slug,
        pageSize,
        startAfter,
        orderBy,
        status,
      );

      // Get sessions by community slug
      return sessionStore(firestore).findByCommunityWithStatuses({
        communitySlug: slug,
        statuses: status,
        orderBy,
        pageSize,
        startAfter,
      });
    },

    followers: () => {},
    moderators: () => {},
  },
};
