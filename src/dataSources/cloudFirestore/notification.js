import debug from 'debug';

const dlog = debug('that:api:events:dataSources:firebase:notification');

const collectionName = 'events';
const subCollectionName = 'notifications';

const event = dbInstance => {
  dlog('instance created');

  function create(eventId, notification) {
    dlog('create');
    const scrubbedNotification = notification;
    if (notification.link) scrubbedNotification.link = notification.link.href;

    const ref = dbInstance
      .doc(`${collectionName}/${eventId}`)
      .collection(subCollectionName);

    return ref.add(scrubbedNotification).then(doc => ({
      id: doc.id,
      ...scrubbedNotification,
    }));
  }

  async function findAll(eventId) {
    dlog('findAll');
    const colSnapshot = dbInstance
      .doc(`${collectionName}/${eventId}`)
      .collection(subCollectionName);

    const { docs } = await colSnapshot.get();

    const results = docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    return results;
  }

  function update(eventId, notificationId, notification) {
    dlog('update');
    const scrubbedNotification = notification;
    if (notification.link) scrubbedNotification.link = notification.link.href;

    const documentRef = dbInstance.doc(
      `${collectionName}/${eventId}/${subCollectionName}/${notificationId}`,
    );

    return documentRef.update(scrubbedNotification).then(res => ({
      id: notificationId,
      ...scrubbedNotification,
    }));
  }

  function remove(eventId, notificationId) {
    dlog('remove');
    const documentRef = dbInstance.doc(
      `${collectionName}/${eventId}/${subCollectionName}/${notificationId}`,
    );

    return documentRef.delete().then(res => notificationId);
  }

  return { create, findAll, update, remove };
};

export default event;
