import debug from 'debug';

const dlog = debug('that:api:events:datasources:firebase:community');

const communityColName = 'communities';
const eventColName = 'events';

function scrubCommunity({ community, user, isNew }) {
  const scrubbedCommunity = community;
  const rightNow = new Date();
  if (isNew) {
    scrubbedCommunity.createdAt = rightNow;
    scrubbedCommunity.createdBy = user.sub;
  }
  scrubbedCommunity.lastUpdatedAt = rightNow;
  scrubbedCommunity.lastUpdatedBy = user.sub;

  return scrubbedCommunity;
}

const community = dbInstance => {
  dlog('instance created');

  const communityCol = dbInstance.collection(communityColName);
  const eventCol = dbInstance.collection(eventColName);

  async function getAll() {
    dlog('getAll');
    const { docs } = await communityCol.get();

    return docs.map(cm => ({
      id: cm.id,
      ...cm.data(),
    }));
  }

  async function get(id) {
    dlog('get called %s', id);

    const doc = await dbInstance.doc(`${communityColName}/${id}`).get();

    let result = {
      id: doc.id,
      ...doc.data(),
    };
    if (!result.name) result = null;

    return result;
  }

  async function getSlug(id) {
    dlog('find slug from id %s', id);
    const doc = await dbInstance.doc(`${communityColName}/${id}`).get();

    let result = {
      id: doc.id,
      slug: doc.get('slug'),
    };
    if (!result.slug) result = null;

    return result;
  }

  async function findIdFromSlug(slug) {
    dlog('findIdFromSlug %s', slug);

    const slimslug = slug.trim();
    const { size, docs } = await communityCol
      .where('slug', '==', slimslug)
      .select() // no fields selected so returns doc ref with no data :)
      .get();

    dlog('size: %O', size);
    let result = null;
    if (size === 1) {
      const [d] = docs;
      result = {
        id: d.id,
      };
    } else if (size > 1) {
      throw new Error(`Multiple Community records found for slug ${slimslug}`);
    }

    dlog('result: %O', result);
    return result;
  }

  async function findBySlug(slug) {
    dlog('findBySlug called %s', slug);

    const slimslug = slug.trim();
    const { size, docs } = await communityCol
      .where('slug', '==', slimslug)
      .get();
    let result = null;
    if (size === 1) {
      dlog('return doc for slug ', slimslug);
      const [d] = docs;
      result = {
        id: d.id,
        ...d.data(),
      };
    } else if (size > 1) {
      throw new Error(`Multiple Community slugs found for slug ${slimslug}`);
    }

    return result;
  }

  async function isSlugTaken(slug) {
    dlog('isSlugTaken? %s', slug);
    const { size } = await communityCol
      .where('slug', '==', slug)
      .select()
      .get();

    return size > 0;
  }

  async function create({ newCommunity, user }) {
    dlog('create new community with slug %s', newCommunity.slug);
    const slugCheck = await isSlugTaken(newCommunity.slug);
    if (slugCheck)
      throw new Error('Slug is already in use. %s', newCommunity.slug);
    const cleanCommunity = scrubCommunity({
      community: newCommunity,
      user,
      isNew: true,
    });
    const newDocRef = await communityCol.add(cleanCommunity);
    const newDocument = await newDocRef.get();

    return {
      id: newDocument.id,
      ...newDocument.data(),
    };
  }

  async function update({ communityId, modifiedCommunity, user }) {
    dlog('update community. %s', communityId);
    const communityDocRef = dbInstance.doc(
      `${communityColName}/${communityId}`,
    );
    const moddedCommunity = scrubCommunity({
      community: modifiedCommunity,
      user,
      isNew: false,
    });

    await communityDocRef.update(moddedCommunity);
    const updatedDoc = await communityDocRef.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };
  }

  return {
    getAll,
    get,
    getSlug,
    isSlugTaken,
    findIdFromSlug,
    findBySlug,
    create,
    update,
  };
};

export default community;
