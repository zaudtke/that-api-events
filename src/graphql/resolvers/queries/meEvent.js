import debug from 'debug';

const dlog = debug('that:api:events:me:query');

export const fieldResolvers = {
  MeEventQuery: {
    favorites: () => {
      dlog('meEventQuery called');
      return {};
    },
  },
};
