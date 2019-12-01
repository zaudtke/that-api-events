const collectionName = 'events';
const subCollectionName = 'notifications';

const event = (dbInstance, logger) => {
  const create = (eventId, notification) => {
    console.log('TCL: create -> notification', notification);
    console.log('TCL: create -> eventId', eventId);

    const scrubbedNotification = notification;
    if (notification.link) scrubbedNotification.link = notification.link.href;

    const ref = dbInstance
      .doc(`${collectionName}/${eventId}`)
      .collection(subCollectionName);

    return ref.add(scrubbedNotification).then(doc => ({
      id: doc.id,
      ...scrubbedNotification,
    }));
  };

  const findAll = async eventId => {
    const colSnapshot = dbInstance
      .doc(`${collectionName}/${eventId}`)
      .collection(subCollectionName);

    const { docs } = await colSnapshot.get();

    const results = docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    return results;
  };

  const update = (eventId, notificationId, notification) => {
    const scrubbedNotification = notification;
    if (notification.link) scrubbedNotification.link = notification.link.href;

    logger.debug(`updating event ${eventId} notification: ${notificationId}`);

    const documentRef = dbInstance.doc(
      `${collectionName}/${eventId}/${subCollectionName}/${notificationId}`,
    );

    return documentRef.update(scrubbedNotification).then(res => ({
      id: notificationId,
      ...scrubbedNotification,
    }));
  };

  const remove = (eventId, notificationId) => {
    const documentRef = dbInstance.doc(
      `${collectionName}/${eventId}/${subCollectionName}/${notificationId}`,
    );

    return documentRef.delete().then(res => {
      logger.debug(`removed event ${eventId} notification: ${notificationId}`);
      return notificationId;
    });
  };

  return { create, findAll, update, remove };
};

export default event;
