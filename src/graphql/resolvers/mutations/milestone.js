import milestoneStore from '../../../dataSources/cloudFirestore/milestone';

export const fieldResolvers = {
  MilestoneMutation: {
    update: async (
      { eventId, milestoneId },
      { milestone },
      { dataSources: { firestore } },
    ) => {
      milestoneStore(firestore).update(eventId, milestoneId, milestone);
    },
  },
};
