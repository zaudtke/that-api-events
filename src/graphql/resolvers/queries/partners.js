import debug from 'debug';

import partnerStore from '../../../dataSources/cloudFirestore/partner';

const dlog = debug('that:api:events:query');

export const fieldResolvers = {
  EventPartnersQuery: {
    level: ({ eventId }, { level }, { dataSources: { firestore } }) => {
      dlog('EventQuery.partners');

      return partnerStore(firestore)
        .findByLevel(eventId, level)
        .then(r =>
          r.map(item => ({
            ...item,
            __typename: 'Partner',
          })),
        );
    },
  },
};
