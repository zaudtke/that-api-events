import debug from 'debug';

const dlog = debug('that:api:event:mutation:favoriting');

export const fieldResolvers = {
  EventFavoritingMutation: {
    toggle: ({ eventId }, __, { dataSources: { firestore }, user }) => {
      dlog('toggle event %s, for user %s', eventId, user.sub);
      throw new Error('not implemented yet');
    },
  },
};
