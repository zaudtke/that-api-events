import eventStore from '../../../dataSources/cloudFirestore/event';
import venueStore from '../../../dataSources/cloudFirestore/venue';

import notificationResolver from './notification';

const resolvers = {
  event: async (parent, { id }, { dataSources: { firestore, logger } }) =>
    eventStore(firestore, logger).get(id),

  events: async (parent, args, { dataSources: { firestore, logger } }) =>
    eventStore(firestore, logger).getAll(),
};

export const fieldResolvers = {
  Event: {
    notifications: notificationResolver.notifications,
    venues: async (
      { venues },
      args,
      { dataSources: { firestore, logger } },
    ) => {
      logger.debug('Event:venues called');
      return venueStore(firestore, logger).findByIds(venues);
    },
  },
};

export default resolvers;
