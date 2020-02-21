import debug from 'debug';

import eventPartnerStore from '../../../dataSources/cloudFirestore/partner';

const dlog = debug('that:api:event:mutation:eventPartner');

export const fieldResolvers = {
  EventPartnerMutation: {
    add: (
      { eventId, partnerId },
      { partner },
      { dataSources: { firestore } },
    ) => {
      dlog('add');
      return eventPartnerStore(firestore).add(eventId, partnerId, partner);
    },

    update: (
      { eventId, partnerId },
      { partner },
      { dataSources: { firestore } },
    ) => {
      dlog('update');
      return eventPartnerStore(firestore).update(eventId, partnerId, partner);
    },

    remove: ({ eventId, partnerId }, _, { dataSources: { firestore } }) => {
      dlog('remove');
      return eventPartnerStore(firestore).remove(eventId, partnerId);
    },
  },
};
