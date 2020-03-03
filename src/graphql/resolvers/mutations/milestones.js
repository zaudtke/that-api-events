export const fieldResolvers = {
  MilestonesMutation: {
    create: ({ eventId }, { milestone }, { dataSources: { firestore } }) => {
      throw new Error('Not implemented yet.');
    },
    delete: ({ eventId }, { id }, { dataSources: { firestore } }) => {
      throw new Error('Not implemented yet.');
    },
    milestone: ({ eventId }, { id }) => ({
      eventId,
      milestoneId: id,
    }),
  },
};
