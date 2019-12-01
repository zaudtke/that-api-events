import event, { fieldResolvers as eventFields } from './event';
import venue from './venue';

export default {
  ...event,
  ...venue,
};

export const fieldResolvers = {
  ...eventFields,
};
