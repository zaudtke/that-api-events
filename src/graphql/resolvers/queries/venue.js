import venueStore from '../../../dataSources/cloudFirestore/venue';

const resolvers = {
  venue: async (parent, { id }, { dataSources: { firestore, logger } }) =>
    venueStore(firestore).find(id),

  venues: async (parent, args, { dataSources: { firestore, logger } }) =>
    venueStore(firestore).findAll(),
};

export default resolvers;
