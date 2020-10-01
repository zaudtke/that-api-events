import debug from 'debug';

const dlog = debug('that:api:events:datasources:firebase:community');

const communityColName = 'communities';
const eventColName = 'events';

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
      dlog('return id for slug %s, %s', d.id, slimslug);
      result = {
        id: d.id,
      };
    } else if (size > 1) {
      throw new Error(`Multiple Community slugs found for slug ${slimslug}`);
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

  async function findActiveEvents(name) {
    const slimname = name.trim().toLowerCase();
    dlog('allActiveEvents for community: %s', slimname);
    const colSnapshot = eventCol
      .where('isActive', '==', true)
      .where('isFeatured', '==', true)
      .where('community', '==', slimname);

    const { size, docs } = await colSnapshot.get();
    let result = null;
    if (size > 0) {
      result = docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));
    }

    return result;
  }

  async function findIsFeaturedEvents(name) {
    dlog('findFeaturedEvents');
    const slimname = name.trim().toLowerCase();
    dlog('allEvents for community: %s', slimname);
    const colSnapshot = eventCol
      .where('isFeatured', '==', true)
      .where('community', '==', slimname);

    const { size, docs } = await colSnapshot.get();
    let result = null;
    if (size > 0) {
      result = docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));
    }

    return result;
  }

  async function findIsActiveEvents(name) {
    dlog('findIsActiveEvents');
    const slimname = name.trim().toLowerCase();
    dlog('allEvents for community: %s', slimname);
    const colSnapshot = eventCol
      .where('isActive', '==', true)
      .where('community', '==', slimname);

    const { size, docs } = await colSnapshot.get();
    let result = null;
    if (size > 0) {
      result = docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));
    }

    return result;
  }

  async function findAllEvents(name) {
    dlog('findAllEvents');
    // There is no logical OR in FireBase. To acheive this we combine two
    // queries into one result.
    const slimname = name.trim().toLowerCase();
    let isActive = await findIsActiveEvents(slimname);
    let isFeatured = await findIsFeaturedEvents(slimname);
    if (isActive === null) isActive = [];
    if (isFeatured === null) isFeatured = [];
    isActive.push(...isFeatured);

    return isActive;
  }

  return {
    getAll,
    get,
    findIdFromSlug,
    findBySlug,
    findActiveEvents,
    findIsActiveEvents,
    findIsFeaturedEvents,
    findAllEvents,
  };
};

export default community;
