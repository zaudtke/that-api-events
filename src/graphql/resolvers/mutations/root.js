const resolvers = {
  events: (parent, args, { dataSources: { logger } }) => {
    logger.info('root:events mutation called');
    return {};
  },
  venues: (parent, args, { dataSources: { logger } }) => {
    logger.info('root:venues mutation called');
    return {};
  },
};

export default resolvers;
