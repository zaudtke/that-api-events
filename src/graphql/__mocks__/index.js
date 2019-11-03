import faker from 'faker';

import event from './event';
import milestone from './milestone';
import venue from './venue';

const mocks = {
  URL: () => faker.internet.url(),
  PhoneNumber: () => faker.phone.phoneNumber(),
  PostalCode: () => faker.address.zipCode(),
  EmailAddress: () => faker.internet.email(),

  Event: event,
  Milestone: milestone,
  Venue: venue,
};

export default () => mocks;
