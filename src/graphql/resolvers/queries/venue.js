import venueStore from '../../../dataSources/cloudFirestore/venue';

const resolvers = {
  venue: async (parent, { id }, { dataSources, logger }) =>
    venueStore(dataSources.firestore).find(id),

  venues: async (parent, args, { dataSources, logger }) =>
    venueStore(dataSources.firestore).findAll(),
};

export default resolvers;
