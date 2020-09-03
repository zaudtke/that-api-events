import fetch from 'node-fetch';
import debug from 'debug';
import envConfig from '../../envConfig';

const dlog = debug('that:api:sessions:slack-callslackhook');

export default function callSlackHook(hookBody) {
  dlog('calling Slack hook');
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.TEST_SLACK_NOTIFICATIONS
  ) {
    const slackUrl = envConfig.slackWebhookUrl;
    fetch(slackUrl, {
      method: 'post',
      body: JSON.stringify(hookBody),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.text())
      .then(res => dlog('Slack webhood response: %o', res))
      .catch(err => dlog('ERROR sending slack notifcation: %O', err));
  } else {
    dlog('DEVELOPMENT Env: SLACK PAYLOAD TO SEND: %o', hookBody);
  }
}
