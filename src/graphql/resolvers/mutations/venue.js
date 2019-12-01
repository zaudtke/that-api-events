/* eslint-disable import/prefer-default-export */
import venueStore from '../../../dataSources/cloudFirestore/venue';

export const fieldResolvers = {
  VenueMutation: {
    update: async (
      { venueId },
      { venue },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('VenueMutation.update called.');

      return venueStore(firestore, logger).update(venueId, venue);
    },
  },
};
