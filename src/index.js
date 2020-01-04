/* eslint-disable import/prefer-default-export */
import 'dotenv/config';
import connect from 'connect';
import cors from 'cors';
import debug from 'debug';
import { Firestore } from '@google-cloud/firestore';
import pino from 'pino';
import responseTime from 'response-time';
import uuid from 'uuid/v4';
import * as Sentry from '@sentry/node';

import apolloGraphServer from './graphql';
import { version } from '../package.json';

const dlog = debug('that:api:events:index');
const defaultVersion = `that-api-events@${version}`;
const firestore = new Firestore();
const api = connect();

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: JSON.parse(process.env.LOG_PRETTY_PRINT || false)
    ? { colorize: true }
    : false,
  mixin() {
    return {
      service: 'that-api-events',
    };
  },
});

dlog('function instance created');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.THAT_ENVIRONMENT,
  release: process.env.SENTRY_VERSION || defaultVersion,
  debug: process.env.NODE_ENV === 'development',
});

Sentry.configureScope(scope => {
  scope.setTag('thatApp', 'that-api-events');
});

const createConfig = () => {
  dlog('createConfig');

  return {
    dataSources: {
      sentry: Sentry,
      logger,
      firestore,
    },
  };
};

const graphServer = apolloGraphServer(createConfig());

function sentryMark(req, res, next) {
  Sentry.addBreadcrumb({
    category: 'that-api-events',
    message: 'init',
    level: Sentry.Severity.Info,
  });
  next();
}

function createUserContext(req, res, next) {
  const enableMocking = () => {
    if (!req.headers['that-enable-mocks']) return false;

    logger.info('mocking enabled');

    const headerValues = req.headers['that-enable-mocks'].split(',');
    const mocks = headerValues.map(i => i.trim().toUpperCase());

    return !!mocks.includes('EVENTS');
  };

  const correlationId = req.headers['that-correlation-id']
    ? req.headers['that-correlation-id']
    : uuid();

  const contextLogger = logger.child({ correlationId });

  req.userContext = {
    locale: req.headers.locale,
    authToken: req.headers.authorization,
    correlationId: req.headers['that-correlation-id']
      ? req.headers['that-correlation-id']
      : uuid(),
    enableMocking: enableMocking(),
    sentry: Sentry,
    logger: contextLogger,
  };

  next();
}

function apiHandler(req, res) {
  dlog('api handler called');

  const graphApi = graphServer.createHandler();

  graphApi(req, res);
}

function failure(err, req, res, next) {
  dlog('error %o', err);

  logger.error(err);
  logger.trace('Middleware Catch All');

  Sentry.captureException(err);

  res
    .set('Content-Type', 'application/json')
    .status(500)
    .json(err);
}

export const graphEndpoint = api
  .use(cors())
  .use(responseTime())
  .use(sentryMark)
  .use(createUserContext)
  .use(apiHandler)
  .use(failure);
