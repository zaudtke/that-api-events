import venueStore from '../../../dataSources/cloudFirestore/venue';

export const fieldResolvers = {
  VenuesMutation: {
    create: async (parent, { venue }, { dataSources: { firestore } }) =>
      venueStore(firestore).create(venue),

    delete: (parent, { id }, { dataSources: { firestore } }) => {
      throw new Error('Not implemented yet.');
    },

    venue: (parent, { id }) => ({ venueId: id }),
  },
};
