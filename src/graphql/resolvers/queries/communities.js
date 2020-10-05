import debug from 'debug';

import communityStore from '../../../dataSources/cloudFirestore/community';

const dlog = debug('that:api:comunities:query');

export const fieldResolvers = {
  CommunitiesQuery: {
    // Returns all communities in data store
    all: (_, __, { dataSources: { firestore } }) => {
      dlog('all called');

      return communityStore(firestore).getAll();
    },

    // return community with mathing id
    community: (_, { input }, { dataSources: { firestore } }) => {
      dlog('community top level called %s', input);
      if (!input.slug && !input.id)
        throw new Error(
          'community querty requires an id or slug. Neither provided',
        );

      let result = null;
      if (input.slug && !input.id) {
        dlog('find community id by slug');
        return communityStore(firestore)
          .findIdFromSlug(input.slug)
          .then(d => {
            if (d) {
              result = {
                communityId: d.id,
                slug: input.slug,
              };
            }
            dlog('slug/id %o', result);
            return result;
          });
      }
      dlog('community by id');
      // id only or id and slug sent
      // get slug/verify slug-id relationship
      return communityStore(firestore)
        .getSlug(input.id)
        .then(c => {
          if (c) {
            if (input.slug && input.slug !== c.slug)
              throw new Error('Community slug and id provided do not match.');
            result = {
              communityId: c.id,
              slug: c.slug,
            };
          }
          dlog('slug/id result %o', result);
          return result;
        });
    },

    // // Return community with matching slug
    // communityBySlug: (_, { slug }, { dataSources: { firestore } }) => {
    //   dlog('communityBySlug called, %s', slug);

    //   return communityStore(firestore)
    //     .findIdFromSlug(slug)
    //     .then(d => ({ communityId: d ? d.id : null }));
    // },

    /*
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
      { name },
      { hours, start },
      { dataSources: { firestore } },
    ) => {
      dlog('sendDialog called for %s, hours: %s', name, hours);
      if (!hours) throw new Error('hours parameter required');
      if (hours < 1) throw new Error('hours minimum value is 1');
      if (hours > 168) throw new Error('hours maximum value is 168');
      const activeEvents = await communityStore(firestore).findIsActiveEvents(
        name,
      );
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

        return sessions.map(s => ({ id: s.id }));
      }
      return null;
    },
    */
  },
};
