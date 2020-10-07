import debug from 'debug';

import communityStore from '../../../dataSources/cloudFirestore/community';

const dlog = debug('that:api:comunities:query');

export const fieldResolvers = {
  CommunitiesQuery: {
    // Returns all communities in data store
    all: (_, __, { dataSources: { firestore } }) => {
      dlog('all called');

      return communityStore(firestore).getAllActive();
    },

    // return community with mathing id
    community: (_, { input }, { dataSources: { firestore } }) => {
      dlog('community top level called %s', input);
      if (!input.slug && !input.id)
        throw new Error(
          'community input requires an id or slug. Neither provided',
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
  },
};
