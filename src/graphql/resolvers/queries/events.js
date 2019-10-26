import eventStore from '../../../dataSources/cloudFirestore/event';

const resolvers = {
  events: async (parent, args, { dataSources }) =>
    eventStore(dataSources.firestore).getAll(),
};

export default resolvers;
