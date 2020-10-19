import debug from 'debug';

const dlog = debug('that:api:communities:me:query');

export const fieldResolvers = {
  MeCommunityQuery: {
    favorites: () => {
      dlog('meCommunityQuery called');
      return {};
    },
  },
};
