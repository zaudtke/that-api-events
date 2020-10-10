import debug from 'debug';

const dlog = debug('that:api:events:datasources:firebase:members');

const collectionName = 'members';

const member = dbInstance => {
  dlog('instance created');

  const membersCollection = dbInstance.collection(collectionName);

  async function getMemberTotal() {
    dlog('total member count');
    return membersCollection
      .where('isDeactivated', '==', false)
      .select()
      .get()
      .then(snap => snap.size);
  }

  async function find(memberId) {
    dlog('find %s', memberId);
    const docRef = await dbInstance.doc(`${collectionName}/${memberId}`).get();
    let result = null;
    if (docRef.exists)
      result = {
        id: docRef.id,
        canFeature: docRef.get('canFeature'),
        isDeactivated: docRef.get('isDeactivated'),
      };

    return result;
  }

  async function findBatch(memberIds) {
    dlog('findBatch of %d', memberIds.length);

    const docFuncs = memberIds.map(id => find(id));

    return Promise.all(docFuncs).then(result => result);
  }

  return { getMemberTotal, find, findBatch };
};

export default member;
