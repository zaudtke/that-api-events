import debug from 'debug';

const dlog = debug('that:api:communities:mutation:favoriting');

export const fieldResolvers = {
  CommunityFavoritingMutation: {
    toggle: (
      { communityId, slug },
      __,
      { dataSources: { firestore }, user },
    ) => {
      dlog('toggle community %s, for user %s', slug, user.sub);
    },
  },
};
