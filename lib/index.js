const _ = require('lodash');
const router = require('express').Router;
const urlTemplate = require('url-template');

const errors = require('./errors');

const _ROUTES = {};

function urlTemplateFromPath(path) {
    return path.replace(/:([\w]+)/g, '{$1}');
}

function simpleClean(pathname) {
    return pathname.replace(/\/\//g, '/').replace(/\/$/, '') || '/';
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
        this.baseUrl = simpleClean(`${prefix}/${subPath}`);
        this.subPath = subPath;
    }

    use(routesInfo) {
        this.router.use(routesInfo.subPath, routesInfo.router);
    }

    route(name, subPath) {
        if (_ROUTES[name]) {
            throw new errors.DuplicateNameError(`Route named '${name}' already defined for '${_ROUTES[name].pathname}'.`);
        }

        const pathname = simpleClean(`${this.baseUrl}${subPath}`);

        _ROUTES[name] = {
            name,
            pathname,
            template: urlTemplate.parse(urlTemplateFromPath(pathname))
        };

        return this.router.route(subPath);
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
