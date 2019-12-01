/* eslint-disable import/prefer-default-export */
export const fieldResolvers = {
  MilestonesMutation: {
    create: (
      { eventId },
      { milestone },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('MilestonesMutation:create called');
      throw new Error('Not implemented yet.');
    },
    delete: ({ eventId }, { id }, { dataSources: { firestore, logger } }) => {
      logger.debug('MilestonesMutation:delete called');
      throw new Error('Not implemented yet.');
    },
    milestone: ({ eventId }, { id }) => ({
      eventId,
      milestoneId: id,
    }),
  },
};
