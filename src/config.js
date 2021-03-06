'use strict';

let logger = require('./utils/logger-winston.js');

const useDotenv = process.env.CI !== 'yes' && process.env.CI !== true;

logger.warn(`Using dotenv condition is: ${useDotenv}`);

if (useDotenv === true) {
  logger.warn('Initializing dotenv (requires .env file)');
  let dotenvPath = null;
  switch (process.env.NODE_ENV) {
    case 'production':
      dotenvPath = '.env_prod';
      break;
    case 'e2e':
      dotenvPath = '.env_e2e';
      break;
    default:
    case 'development':
      dotenvPath = '.env';
      break;
  }

  const dotenv = require('dotenv').config({path: dotenvPath});
  if (dotenv.error) {
    throw dotenv.error;
  }
  logger.debug(`dotenv ${process.env.NODE_ENV}`, dotenv.parsed);
}

module.exports = {

  isCI                          : () => process.env.CI === 'yes' || process.env.CI === true,
  isProd                        : () => process.env.NODE_ENV === 'production',
  isTest                        : () => process.env.NODE_ENV === 'test',
  isDisableRestAuthMiddleware   : () => !!process.env.DISABLE_REST_AUTH_MIDDLEWARE,

  // used to run this server as back-end for inntegration testing on client-side
  // this method isn't used for integration testing on server-side
  isForE2eTest                  : () => process.env.NODE_ENV === 'e2e',

  NODE_ENV                      : process.env.NODE_ENV,
  CI                            : process.env.CI,
  PORT                          : process.env.PORT,
  JWT_SECRET                    : process.env.JWT_SECRET,
  USER_EMAIL                    : process.env.USER_EMAIL,
  PASS_EMAIL                    : process.env.PASS_EMAIL,
  RECAPTCHA_SECRET              : process.env.RECAPTCHA_SECRET,
  MONGODB_URI                   : process.env.MONGODB_URI,
  MONGODB_TESTING_URI           : process.env.MONGODB_TESTING_URI,

  // re-assign all process.env variables to be used in this app and defined with dotenv to constants
  // In this way I can see all variables defined with donenv and used in this app
  // In CI I can't use dotenv => I provide default values for all these constants
  FRONT_END_PATH                : process.env.FRONT_END_PATH                || '../My-MEAN-website-client/dist',
  LARGE_PAYLOAD_MESSAGE         : process.env.LARGE_PAYLOAD_MESSAGE         || 'stop it!',
  EXPRESS_SESSION_SECRET        : process.env.EXPRESS_SESSION_SECRET        || 'keyboard cat',
  HELMET_HIDE_POWERED_BY        : process.env.HELMET_HIDE_POWERED_BY        || 'f__k u idiot',
  HELMET_REFERRER_POLICY        : process.env.HELMET_REFERRER_POLICY        || 'no-referrer',
  HELMET_HPKP_SHA256S_1         : process.env.HELMET_HPKP_SHA256S_1         || 'AbCdEf123=',
  HELMET_HPKP_SHA256S_2         : process.env.HELMET_HPKP_SHA256S_2         || 'ZyXwVu456=',
  HELMET_HPKP_REPORT_URI        : process.env.HELMET_HPKP_REPORT_URI        || 'https://example.com/hpkp-report',
  HELMET_EXPECT_CT_REPORT_URI   : process.env.HELMET_EXPECT_CT_REPORT_URI   || 'https://example.com/expect-ct-report',
  REDIS_HOST                    : process.env.REDIS_HOST                    || 'localhost',
  REDIS_PORT                    : process.env.REDIS_PORT                    || 6379,
  REDIS_TTL                     : process.env.REDIS_TTL                     || 260,


  FACEBOOK_APP_ID               : process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET           : process.env.FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL         : process.env.FACEBOOK_CALLBACK_URL,

  TWITTER_CONSUMER_KEY          : process.env.TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET       : process.env.TWITTER_CONSUMER_SECRET,
  TWITTER_CALLBACK_URL          : process.env.TWITTER_CALLBACK_URL,
  TWITTER_PROFILE_URL           : process.env.TWITTER_PROFILE_URL,

  GOOGLE_CLIENT_ID              : process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET          : process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL           : process.env.GOOGLE_CALLBACK_URL,

  GITHUB_CLIENT_ID              : process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET          : process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL           : process.env.GITHUB_CALLBACK_URL,

  LINKEDIN_CLIENT_ID            : process.env.LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET        : process.env.LINKEDIN_CLIENT_SECRET,
  LINKEDIN_CALLBACK_URL         : process.env.LINKEDIN_CALLBACK_URL
};