/* eslint-disable import/prefer-default-export */
import eventStore from '../../../dataSources/cloudFirestore/event';

export const fieldResolvers = {
  EventMutation: {
    event: async (
      parent,
      { id, event },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('EventMutation.event called.');
      return eventStore(firestore, logger).update(id, event);
    },
    notifications: () => ({}),
    milestones: () => ({}),
    venues: () => ({}),
  },
};
