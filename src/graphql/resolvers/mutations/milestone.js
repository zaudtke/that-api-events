/* eslint-disable import/prefer-default-export */
export const fieldResolvers = {
  MilestoneMutation: {
    update: (
      { eventId, milestoneId },
      { milestone },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('MilestoneMutation:milestone called');
      throw new Error('Not implemented yet.');
    },
  },
};
