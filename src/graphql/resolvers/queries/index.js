import root from './root';
import { fieldResolvers as eventFields } from './event';
import { fieldResolvers as eventsFields } from './events';

import { fieldResolvers as venuesFields } from './venues';

import { fieldResolvers as eventPartnerFields } from './partners';

export default {
  ...root,
};

export const fieldResolvers = {
  ...eventFields,
  ...eventsFields,
  ...venuesFields,
  ...eventPartnerFields,
};
