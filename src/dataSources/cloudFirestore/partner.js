import debug from 'debug';

const dlog = debug('that:api:events:datasources:firebase:events:partner');

function partnerCollection(dbInstance) {
  dlog('instance created');

  const collectionName = 'events';
  const subCollectionName = 'partners';

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

  async function add(eventId, partnerId, partner) {
    dlog('add');

    const ref = dbInstance.doc(
      `${collectionName}/${eventId}/${subCollectionName}/${partnerId}`,
    );

    await ref.set(partner, { merge: true });
    const updatedDoc = await ref.get();

    return {
      id: ref.id,
      ...updatedDoc.data(),
    };
  }

  function update(eventId, partnerId, partner) {
    dlog('update');

    const documentRef = dbInstance.doc(
      `${collectionName}/${eventId}/${subCollectionName}/${partnerId}`,
    );

    return documentRef.update(partner).then(res => ({
      id: partnerId,
      ...partner,
    }));
  }

  function remove(eventId, partnerId) {
    dlog('remove');
    const documentRef = dbInstance.doc(
      `${collectionName}/${eventId}/${subCollectionName}/${partnerId}`,
    );

    return documentRef.delete().then(res => {
      dlog(`removed event ${eventId} notification: ${partnerId}`);
      return partnerId;
    });
  }

  return { add, update, remove, findAll };
}

export default partnerCollection;
