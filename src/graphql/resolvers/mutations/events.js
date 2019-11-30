/* eslint-disable import/prefer-default-export */
import eventStore from '../../../dataSources/cloudFirestore/event';

export const fieldResolvers = {
  EventsMutation: {
    create: async (
      parent,
      { event },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('EventsMutation:create called.');

      return eventStore(firestore, logger).create(event);
    },
    delete: () => ({}),
    update: () => ({}),
  },
};
