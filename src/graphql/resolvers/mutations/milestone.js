export const fieldResolvers = {
  MilestoneMutation: {
    update: (
      { eventId, milestoneId },
      { milestone },
      { dataSources: { firestore } },
    ) => {
      throw new Error('Not implemented yet.');
    },
  },
};
