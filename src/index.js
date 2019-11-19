/* eslint-disable import/prefer-default-export */
import 'dotenv/config';
import { Firestore } from '@google-cloud/firestore';
import connect from 'connect';
import responseTime from 'response-time';
import uuid from 'uuid/v4';
import * as Sentry from '@sentry/node';

import apolloGraphServer from './graphql';

const api = connect();
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.THAT_ENVIRONMENT,
});

const createConfig = () => ({
  dataSources: {
    sentry: Sentry,
    firestore: new Firestore(),
  },
});

const sentryMark = (req, res, next) => {
  Sentry.addBreadcrumb({
    category: 'that-api-events',
    message: 'init',
    level: Sentry.Severity.Info,
  });
  next();
};

/**
 * http middleware function
 * here we are intercepting the http call and building our own notion of a users context.
 * we then add it to the request so it can later be used by the gateway.
 * If you had something like a token that needs to be passed through to the gateways children this is how you intercept it and setup for later.
 *
 * @param {string} req - http request
 * @param {string} res - http response
 * @param {string} next - next function to execute
 *
 */
const createUserContext = (req, res, next) => {
  const enableMocking = () => {
    if (!req.headers['that-enable-mocks']) return false;

    const headerValues = req.headers['that-enable-mocks'].split(',');
    const mocks = headerValues.map(i => i.trim().toUpperCase());

    return !!mocks.includes('EVENTS');
  };

  req.userContext = {
    locale: req.headers.locale,
    authToken: req.headers.authorization,
    correlationId: req.headers['that-correlation-id']
      ? req.headers['that-correlation-id']
      : uuid(),
    enableMocking: enableMocking(),
    sentry: Sentry,
  };

  next();
};

const apiHandler = (req, res) => {
  try {
    const graphServer = apolloGraphServer(
      createConfig(),
      req.userContext.enableMocking,
    );
    const graphApi = graphServer.createHandler({
      cors: {
        origin: '*',
        credentials: true,
      },
    });

    graphApi(req, res);
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.error(e);
    Sentry.captureException(e);
    res
      .set('Content-Type', 'application/json')
      .status(500)
      .send(new Error(e));
  }
};

/**
 * http middleware function that follows adhering to express's middleware.
 * Last item in the middleware chain.
 * This is your api handler for your serverless function
 */
export const graphEndpoint = api
  .use(responseTime())
  .use(sentryMark)
  .use(createUserContext)
  .use(apiHandler);
