import eventStore from '../../../dataSources/cloudFirestore/event';
import notificationResolver from './notification';

const resolvers = {
  event: async (parent, { id }, { dataSources }) =>
    eventStore(dataSources.firestore).get(id),

  events: async (parent, args, { dataSources }) =>
    eventStore(dataSources.firestore).getAll(),
};

export const fieldResolvers = {
  Event: {
    notifications: notificationResolver.notifications,
  },
};

export default resolvers;
