import root from './root';
import { fieldResolvers as eventFields } from './event';
import { fieldResolvers as eventsFields } from './events';
import { fieldResolvers as venuesFields } from './venues';
import { fieldResolvers as eventPartnerFields } from './partners';
import { fieldResolvers as communityFields } from './community';
import { fieldResolvers as communitiesFields } from './communities';
import { fieldResolvers as meCommunityFields } from './meCommunities';
import { fieldResolvers as meCommunityFavFields } from './meCommunityFavorites';

export default {
  ...root,
};

export const fieldResolvers = {
  ...eventFields,
  ...eventsFields,
  ...venuesFields,
  ...eventPartnerFields,
  ...communityFields,
  ...communitiesFields,
  ...meCommunityFields,
  ...meCommunityFavFields,
};
