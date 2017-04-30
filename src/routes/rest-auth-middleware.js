'use strict';

// ------------- imported from ./index.js ---------------

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const Utils = require('../utils/util');

module.exports.restAuthenticationMiddleware = function(req, res, next) {
	logger.warn('restAuthenticationMiddleware - req.session.authToken:' + req.session.authToken);

	// For testing purposes it could be useful to bypass this authentication middleware
	// to be able to modify the session.
	// There are some tests that are using this bypass to cover all statements and
	// branches.
	// ATTENTION - USE THIS FEATURE ONLY FOR TESTING PURPOSES!!!!!!!
	if(process.env.DISABLE_REST_AUTH_MIDDLEWARE === 'yes' && (process.env.NODE_ENV === 'test' || process.env.CI )) {
		// authentication middleware DISABLED
		console.warn('restAuthMiddleware disabled - because you are running this app with both ' +
			'DISABLE_REST_AUTH_MIDDLEWARE === yes and (process.env.NODE_ENV === test or process.env.CI === yes)');
			logger.warn('restAuthenticationMiddleware - req.session.authToken:' + req.session.authToken);
    return next();
	}

	try {
		if (!req.session.authToken) {
      logger.error('restAuthenticationMiddleware - req.session.authToken not valid');
      Utils.sendJSONres(res, 403, 'No token provided');
      return;
		}
    const authToken = JSON.parse(req.session.authToken);
    const token = authToken.token;
    logger.debug('restAuthenticationMiddleware - parsed token:' + token);
    if(!token) {
      logger.error('restAuthenticationMiddleware - Token not found');
      Utils.sendJSONres(res, 404, 'Token not found');
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(err) {
        logger.error('restAuthenticationMiddleware - jwt.verify error');
        Utils.sendJSONres(res, 401, 'Jwt not valid or corrupted');
        return;
      }

      if(!decoded) {
        logger.error('restAuthenticationMiddleware - decoded is not valid (but before err was ok - WTF!!!)');
        Utils.sendJSONres(res, 500, 'Impossible to check if jwt is valid - decoded is not valid');
        return;
      }

      logger.warn('restAuthenticationMiddleware - decoded is valid');

      try {
        logger.warn(token);
        let isJwtValidDate = Utils.isJwtValidDate(decoded);
        logger.warn('isJwtValidDate');
        logger.warn(isJwtValidDate);

        if(!isJwtValidDate) {
          logger.error('restAuthenticationMiddleware - jwt has an invalid data');
          Utils.sendJSONres(res, 404, 'Data is not valid');
          return;
        }

        logger.warn('systemDate valid');
        return next();

      } catch (e) {
        logger.error('restAuthenticationMiddleware - error during Utils.isJwtValidDate');
        Utils.sendJSONres(res, 500, 'Impossible to check if jwt is valid');
      }
    });
	} catch(e) {
		logger.error('restAuthenticationMiddleware - exception catched');
		Utils.sendJSONres(res, 403, 'No token provided');
	}
};
