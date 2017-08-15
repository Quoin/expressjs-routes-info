const _ = require('lodash');
const router = require('express').Router;

const cache = require('./cache');
const errors = require('./errors');
const expressPath = require('./express-path');
const simpleClean = require('./simple-clean');
const staticPath = require('./static-path');

const HTTP_METHODS = [
    'delete',
    'get',
    'head',
    'options',
    'patch',
    'post',
    'put',
    'trace'
];

class RoutesInfo {
    constructor(subPath, baseUrl) {
        if (!subPath) {
            throw new errors.MissingArgument(`Missing argument 'subPath'.`);
        } else if (subPath.charAt(0) !== '/') {
            throw new errors.InvalidValue(`'subPath' must start with '/'.`);
        } else if (!baseUrl) {
            throw new errors.MissingArgument(`Missing argument 'baseUrl'.`);
        } else if (baseUrl.charAt(0) !== '/') {
            throw new errors.InvalidValue(`'baseUrl' must start with '/'.`);
        }

        this.router = router();
        this.baseUrl = simpleClean(`${baseUrl}${subPath}`);
        this.subPath = subPath;
    }

    use(routesInfo, middlewares) {
        const args = [expressPath(routesInfo.subPath)];

        args.push(routesInfo.router);

        if (middlewares) {
            if (_.isFunction(middlewares)) {
                args.push(middlewares);
            } else if (_.isArray(middlewares)) {
                args.push.apply(args, middlewares);
            }
        }

        this.router.use.apply(this.router, args);
    }

    route(name, subPath, implementations) {
        const pathname = simpleClean(`${this.baseUrl}${subPath}`);

        cache(name, pathname);

        const route = this.router.route(expressPath(subPath));

        if (implementations) {
            ['all'].concat(HTTP_METHODS).forEach((method) => {
                if (implementations[method]) {
                    route[method](implementations[method]);
                }
            });
        }

        return route;
    }
}

RoutesInfo.expand = cache.expand;
RoutesInfo.all = cache.all;
RoutesInfo.staticPath = staticPath;

// TODO: Figure out how to display all express routes.
// RoutesInfo.debug = (app) => {
//     let stack;
//
//     console.log('RoutesInfo.debug(): app=', app);
//     if (app._router) {
//         console.log("RoutesInfo.debug():     is an app.");
//         stack = app._router.stack;
//     } else if (app.stack) {
//         console.log("RoutesInfo.debug():     is a router.");
//         stack = app.stack;
//     }
//
//     stack.forEach((item) => {
//         console.log("RoutesInfo.debug():   item=", item);
//         if (item.name !== 'router') {
//
//         }
//     });
// };

module.exports = RoutesInfo;
