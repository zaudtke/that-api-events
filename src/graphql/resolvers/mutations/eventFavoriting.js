import debug from 'debug';

const dlog = debug('that:api:event:mutation:favoriting');

export const fieldResolvers = {
  EventFavoritingMutation: {
    toggle: ({ eventId }, __, { dataSources: { firestore }, user }) => {
      dlog('toggle community %s, for user %s', slug, user.sub);
    },
  },
};
