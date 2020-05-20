import debug from 'debug';

const dlog = debug('that:api:comunities:query');

export const fieldResolvers = {
  CommunitiesQuery: {
    all: (_, __, ___) => {
      dlog('not implemented');
    },
  },
};
