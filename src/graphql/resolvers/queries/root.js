import debug from 'debug';

const dlog = debug('that:api:events:query');

const resolvers = {
  events: () => {
    dlog('root:events query called');
    return {};
  },
  venues: () => {
    dlog('root:venues query called');
    return {};
  },
  communities: () => {
    dlog('root:communities query called');
    return {};
  },
};

export default resolvers;
