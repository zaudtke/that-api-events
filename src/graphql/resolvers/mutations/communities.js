import debug from 'debug';
import communityStore from '../../../dataSources/cloudFirestore/community';

const dlog = debug('that:api:communities:mutation');

export const fieldResolvers = {
  CommunitiesMutation: {
    create: (_, { community }, { dataSources: { firestore }, user }) => {
      dlog('create %s', community.slug);
      return communityStore(firestore).create({
        newCommunity: community,
        user,
      });
    },

    delete: (_, __, ___) => {
      dlog('delete');
      throw new Error('Not implemented yet.');
    },

    community: (_, { input }, { dataSources: { firestore } }) => {
      dlog('community called %s', input);
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
