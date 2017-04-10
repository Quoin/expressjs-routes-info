const _ = require('lodash');
const router = require('express').Router;
const urlTemplate = require('url-template');

const errors = require('./errors');

const _ROUTES = {};

function urlTemplatePath(path) {
    return path.replace(/:([\w]+)/g, '{$1}');
}

function expressPath(path) {
    return path.replace(/{([\w]+)}/g, ':$1');
}

function simpleClean(pathname) {
    return urlTemplatePath(pathname.replace(/\/+/g, '/').replace(/\/$/, '') || '/');
}

class RoutesInfo {
    constructor(subPath, prefix) {
        if (!subPath) {
            throw new errors.MissingArgument(`Missing argument 'subPath'.`);
        } else if (subPath.charAt(0) !== '/') {
            throw new errors.InvalidValue(`'subPath' must start with '/'.`);
        } else if (!prefix) {
            throw new errors.MissingArgument(`Missing argument 'prefix'.`);
        } else if (prefix.charAt(0) !== '/') {
            throw new errors.InvalidValue(`'prefix' must start with '/'.`);
        }

        this.router = router();
        this.baseUrl = simpleClean(`${prefix}${subPath}`);
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

    route(name, subPath) {
        if (_ROUTES[name]) {
            throw new errors.DuplicateNameError(`Route named '${name}' already defined for '${_ROUTES[name].pathname}'.`);
        }

        const pathname = simpleClean(`${this.baseUrl}${subPath}`);

        _ROUTES[name] = {
            name,
            pathname,
            template: urlTemplate.parse(urlTemplatePath(pathname))
        };

        return this.router.route(expressPath(subPath));
    }
}

RoutesInfo.expand = (name, data) => {
    if (data) {
        return _ROUTES[name] ? _ROUTES[name].template.expand(data) : undefined;
    }
    return _ROUTES[name] ? _ROUTES[name].pathname : undefined;
};

RoutesInfo.all = () => {
    return _.cloneDeep(_ROUTES);
};

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
