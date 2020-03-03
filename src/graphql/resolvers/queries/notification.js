import debug from 'debug';
import notificationStore from '../../../dataSources/cloudFirestore/notification';

const dlog = debug('that:api:events:query');

const resolvers = {
  notifications: (parent, { eventId }, { dataSources: { firestore } }) => {
    dlog('notifications');

    const id = eventId || parent.id;
    return notificationStore(firestore).findAll(id);
  },
};

export default resolvers;
