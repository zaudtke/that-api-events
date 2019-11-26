const collectionName = 'events';
const subCollectionName = 'notifications';

const event = (dbInstance, logger) => {
  const create = (eventId, notification) => {
    const ref = dbInstance
      .doc(`${collectionName}/${eventId}`)
      .collection(subCollectionName);

    return ref.add(notification).then(doc => ({
      id: doc.id,
      ...notification,
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
    logger.debug(`updating event ${eventId} notification: ${notificationId}`);

    const documentRef = dbInstance.doc(
      `${collectionName}/${eventId}/${subCollectionName}/${notificationId}`,
    );

    return documentRef.set(notification).then(res => ({
      id: notificationId,
      ...notification,
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
