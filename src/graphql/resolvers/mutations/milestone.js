import milestoneStore from '../../../dataSources/cloudFirestore/milestone';

export const fieldResolvers = {
  MilestoneMutation: {
    update: (
      { eventId, milestoneId },
      { milestone },
      { dataSources: { firestore } },
    ) => milestoneStore(firestore).update(eventId, milestoneId, milestone),
  },
};
