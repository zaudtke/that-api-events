/* eslint-disable import/prefer-default-export */
export const fieldResolvers = {
  VenuesMutation: {
    create: (parent, { venue }, { dataSources: { firestore, logger } }) => {
      logger.debug('VenuesMutation.create called.');
      throw new Error('Not implemented yet.');
    },
    delete: (parent, { id }, { dataSources: { firestore, logger } }) => {
      logger.debug('VenuesMutation.delete called.');
      throw new Error('Not implemented yet.');
    },
    venue: (parent, { id }) => ({ venueId: id }),
  },
};
