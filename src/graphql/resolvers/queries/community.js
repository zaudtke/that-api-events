import debug from 'debug';
import { dataSources } from '@thatconference/api';

import communityStore from '../../../dataSources/cloudFirestore/community';
import eventStore from '../../../dataSources/cloudFirestore/event';
import sessionStore from '../../../dataSources/cloudFirestore/session';
import memberStore from '../../../dataSources/cloudFirestore/members';
import slackDigest from '../../../lib/slack/slackDigest';

const favoriteStore = dataSources.cloudFirestore.favorites;
const favoriteType = 'community';
const dlog = debug('that:api:community:query');

export const fieldResolvers = {
  CommunityQuery: {
    get: ({ communityId }, __, { dataSources: { firestore } }) => {
      dlog('get called %s', communityId);

      if (!communityId) return null;

      return communityStore(firestore).get(communityId);
    },

    stats: async ({ slug }, __, { dataSources: { firestore } }) => {
      dlog('stats called %s', slug);
      if (!slug) return [];

      const allEvents = await eventStore(firestore).findAllByCommunitySlug(
        slug,
      );
      const sessions = await sessionStore(
        firestore,
      ).findAllAcceptedByEventIdBatch(allEvents.map(e => e.id));
      const allSessions = [];
      sessions.forEach(s => allSessions.push(...s));
      const localStats = {
        totalActivities: 0,
        pastActivities: 0,
        futureActivities: 0,
        totalDuration: 0,
        pastDuration: 0,
        futureDuration: 0,
      };
      const today = new Date();
      allSessions.forEach(all => {
        localStats.totalActivities += 1;
        localStats.totalDuration += all.durationInMinutes || 30;
        if (all.startTime < today) {
          localStats.pastActivities += 1;
          localStats.pastDuration += all.durationInMinutes || 30;
        } else {
          localStats.futureActivities += 1;
          localStats.futureDuration += all.durationInMinutes || 30;
        }
      });
      const totalMembers = await memberStore(firestore).getMemberTotal();
      return {
        totalMembers,
        totalActivities: localStats.totalActivities,
        pastActivities: localStats.pastActivities,
        upcomingActivities: localStats.futureActivities,
        hoursServed: Math.floor(localStats.pastDuration / 60),
        minutesServed: localStats.pastDuration,
        totalEvents: allEvents.length,
      };
    },

    sendDigest: async (
      { slug },
      { hours, start },
      { dataSources: { firestore } },
    ) => {
      dlog('sendDialog called for %s, hours: %s', slug, hours);
      if (hours < 1) throw new Error('hours minimum value is 1');
      if (hours > 168) throw new Error('hours maximum value is 168');
      const activeEvents = await eventStore(
        firestore,
      ).findActiveByCommunitySlug(slug);
      let digestStart = 'CURRENT_HOUR';
      if (start) digestStart = start;

      let atDate;
      // Date as of now min, sec, ms set to zero
      if (digestStart === 'CURRENT_HOUR') {
        atDate = new Date(new Date().setMinutes(0, 0, 0));
      } else if (digestStart === 'NEXT_HOUR') {
        // now + 1 hour (3600000 ms)
        atDate = new Date(new Date().setMinutes(0, 0, 0) + 3600000);
      } else {
        throw new Error(`Unknown value sent for 'start': ${digestStart}`);
      }
      const hoursAfter = hours || 1;
      const sessionFuncs = activeEvents.map(ev =>
        sessionStore(firestore).findAllApprovedActiveByEventIdAtDateHours(
          ev.id,
          atDate,
          hoursAfter,
        ),
      );
      const sessionRefs = await Promise.all(sessionFuncs);
      const sessions = [];
      sessionRefs.forEach(s => sessions.push(...s));
      let result = [];
      if (sessions.length > 0) {
        slackDigest({ sessions, hours: hoursAfter });

        result = sessions.map(s => ({ id: s.id }));
      }
      return result;
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

    sessions: (
      { slug },
      {
        status = ['APPROVED'],
        filter = 'UPCOMING',
        orderBy,
        asOfDate,
        pageSize = 20,
        cursor,
      },
      { dataSources: { firestore } },
    ) => {
      dlog(
        'sessions called: community %s, page size %d, after %s, orderedBy %s, having statuses %o with filter %s',
        slug,
        pageSize,
        cursor,
        orderBy,
        status,
        filter,
      );

      // Get sessions by community slug
      return sessionStore(firestore).findByCommunityWithStatuses({
        communitySlug: slug,
        statuses: status,
        filter,
        asOfDate,
        orderBy,
        pageSize,
        cursor,
      });
    },

    sessionCount: ({ slug }, { filter }, { dataSources: { firestore } }) => {
      dlog('sessionCount called with filter %s', filter);
      let countFunc;

      if (filter === 'UPCOMING' || filter === 'PAST') {
        countFunc = sessionStore(firestore).getCountByCommunitySlugDate({
          communitySlug: slug,
          date: new Date(),
          direction: filter,
        });
      } else {
        countFunc = sessionStore(firestore).getCountByCommunitySlug({
          communitySlug: slug,
        });
      }

      return countFunc;
    },

    followCount: ({ id }, __, { dataSources: { firestore } }) => {
      dlog('followCount called');
      return favoriteStore(firestore).getFavoriteCount({
        favoritedId: id,
        favoriteType,
      });
    },

    followers: (
      { id },
      { pageSize, cursor },
      { dataSources: { firestore } },
    ) => {
      dlog('followers called');
      return favoriteStore(firestore).getFollowersPaged({
        favoritedId: id,
        favoriteType,
        pageSize,
        cursor,
      });
    },
    moderators: () => {},
  },
};
