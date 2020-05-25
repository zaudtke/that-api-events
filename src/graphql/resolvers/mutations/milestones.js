import milestoneStore from '../../../dataSources/cloudFirestore/milestone';

export const fieldResolvers = {
  MilestonesMutation: {
    create: async (
      { eventId },
      { milestone },
      { dataSources: { firestore } },
    ) => milestoneStore(firestore).create(eventId, milestone),

    delete: async ({ eventId }, { id }, { dataSources: { firestore } }) =>
      milestoneStore(firestore).remove(eventId, id),

    milestone: ({ eventId }, { id }) => ({
      eventId,
      milestoneId: id,
    }),
  },
};
