import eventStore from '../../../dataSources/cloudFirestore/event';

export const fieldResolvers = {
  EventMutation: {
    update: async (
      { eventId },
      { event },
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('EventMutation.event called.');
      return eventStore(firestore, logger).update(eventId, event);
    },
    notifications: ({ eventId }) => ({ eventId }),
    milestones: ({ eventId }) => ({ eventId }),
    partner: ({ eventId }, { id }) => ({ eventId, partnerId: id }),
  },
};
