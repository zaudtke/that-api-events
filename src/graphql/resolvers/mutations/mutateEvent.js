import eventStore from '../../../dataSources/cloudFirestore/event';

const resolvers = {
  createEvent: async (parent, { event }, { dataSources }) =>
    eventStore(dataSources.firestore).create(event),
};

export default resolvers;
