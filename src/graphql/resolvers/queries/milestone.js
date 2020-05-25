import debug from 'debug';
import milestoneStore from '../../../dataSources/cloudFirestore/milestone';

const dlog = debug('that:api:events:query:milestone');

const resolvers = {
  milestones: (parent, { eventId }, { dataSources: { firestore } }) => {
    dlog('milestones');

    const id = eventId || parent.id;
    return milestoneStore(firestore).findAll(id);
  },
};

export default resolvers;
