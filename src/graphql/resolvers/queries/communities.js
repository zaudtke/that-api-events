import debug from 'debug';

import communityStore from '../../../dataSources/cloudFirestore/commumity';
import sessionStore from '../../../dataSources/cloudFirestore/session';
import memberStore from '../../../dataSources/cloudFirestore/members';
import slackDigest from '../../../lib/slack/slackDigest';

const dlog = debug('that:api:comunities:query');

export const fieldResolvers = {
  CommunitiesQuery: {
    active: ({ name }, __, { dataSources: { firestore } }) => {
      dlog('active');
      return communityStore(firestore).findActiveEvents(name);
    },
    all: ({ name }, __, { dataSources: { firestore } }) => {
      dlog('all');
      return communityStore(firestore).findAllEvents(name);
    },
    stats: async ({ name }, __, { dataSources: { firestore } }) => {
      dlog('stats for %s', name);
      // get events for community
      // get sessions for events
      // calculate numbers

      const allEvents = await communityStore(firestore).findAllEvents(name);
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
      const today = new Date(Date.now());
      allSessions.forEach(all => {
        localStats.totalActivities += 1;
        localStats.totalDuration += all.durationInMinutes || 30;
        if (all.startTime.toDate() < today) {
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
    sendDigest: async ({ name }, { hours }, { dataSources: { firestore } }) => {
      dlog('sendDialog called for %s, hours: %s', name, hours);
      if (!hours) throw new Error('hours parameter required');
      if (hours < 1) throw new Error('hours minimum value is 1');
      if (hours > 168) throw new Error('hours maximum value is 168');
      const activeEvents = await communityStore(firestore).findIsActiveEvents(
        name,
      );

      // Date as of now min, sec, ms set to zero
      const atDate = new Date(new Date(Date.now()).setMinutes(0, 0, 0));
      const hoursAfter = hours || 0;
      const sessionFuncs = activeEvents.map(ev =>
        sessionStore(firestore).findAllApprovedByEventIdAtDateHours(
          ev.id,
          atDate,
          hoursAfter,
        ),
      );
      const sessionRefs = await Promise.all(sessionFuncs);
      const sessions = [];
      sessionRefs.forEach(s => sessions.push(...s));
      if (sessions.length > 0) {
        slackDigest({ sessions, hours: hoursAfter });
        return sessions;
      }
      return null;
    },
  },
};
