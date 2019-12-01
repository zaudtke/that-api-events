/* eslint-disable import/prefer-default-export */

export const fieldResolvers = {
  VenueMutation: {
    update: (
      { venueId },
      { venue },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('VenueMutation.update called.');
      throw new Error('Not implemented yet.');
    },
  },
};
