import event, { fieldResolvers as eventFields } from './event';

export default {
  ...event,
};

export const fieldResolvers = {
  ...eventFields,
};
