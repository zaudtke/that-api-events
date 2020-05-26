import debug from 'debug';

const dlog = debug('that:api:events:datasources:firebase:milestone');

const collectionName = 'events';
const subCollectionName = 'milestones';

const event = dbInstance => {
  dlog('instance created');

  function get(eventId, milestoneId) {
    dlog('get milestone: %s from event: %s', milestoneId, eventId);
    const docRef = dbInstance.doc(
      `${collectionName}/${eventId}/${subCollectionName}/${milestoneId}`,
    );

    return docRef.get().then(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  function create(eventId, milestone) {
    dlog('create');
    const scrubbedMilestone = milestone;

    const ref = dbInstance
      .doc(`${collectionName}/${eventId}`)
      .collection(subCollectionName);

    return ref.add(scrubbedMilestone).then(doc => ({
      id: doc.id,
      ...scrubbedMilestone,
    }));
  }

  async function findAll(eventId) {
    dlog('findAll');
    const colSnapshot = dbInstance
      .doc(`${collectionName}/${eventId}`)
      .collection(subCollectionName);

    let result = null;
    const { size, docs } = await colSnapshot.get();
    if (size > 0) {
      result = docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    return result;
  }

  function update(eventId, milestoneId, milestone) {
    dlog('update id: %s on eventId: %s', milestoneId, eventId);
    const scrubbedMilestone = milestone;

    const docref = dbInstance.doc(
      `${collectionName}/${eventId}/${subCollectionName}/${milestoneId}`,
    );
    return docref
      .update(scrubbedMilestone)
      .then(() => get(eventId, milestoneId));
  }

  return { get, create, findAll, update };
};

export default event;
