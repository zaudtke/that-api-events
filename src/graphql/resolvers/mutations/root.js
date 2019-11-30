const resolvers = {
  events: (parent, args, { dataSources: { logger } }) => {
    logger.info('root:events mutation called');
    return {};
  },
};

export default resolvers;
