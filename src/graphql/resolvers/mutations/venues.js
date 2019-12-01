/* eslint-disable import/prefer-default-export */
import venueStore from '../../../dataSources/cloudFirestore/venue';

export const fieldResolvers = {
  VenuesMutation: {
    create: async (
      parent,
      { venue },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('VenuesMutation.create called.');
      return venueStore(firestore, logger).create(venue);
    },

    delete: (parent, { id }, { dataSources: { firestore, logger } }) => {
      logger.debug('VenuesMutation.delete called.');
      throw new Error('Not implemented yet.');
    },

    venue: (parent, { id }) => ({ venueId: id }),
  },
};
