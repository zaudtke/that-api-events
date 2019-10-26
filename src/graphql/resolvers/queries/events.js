import eventStore from '../../../dataSources/cloudFirestore/event';

const resolvers = {
  event: async (parent, { id }, { dataSources }) =>
    eventStore(dataSources.firestore).get(id),

  events: async (parent, args, { dataSources }) =>
    eventStore(dataSources.firestore).getAll(),
};

export default resolvers;
