const _ = require('lodash');
const router = require('express').Router;
const urlTemplate = require('url-template');

const errors = require('./errors');

const _ROUTES = {};

function urlTemplateFromPath(path) {
    return path.replace(/:([\w]+)/g, '{$1}');
}

class RoutesInfo {
    constructor(baseUrl) {
        if (!baseUrl) {
            throw new errors.MissingArgument(`Missing argument 'baseUrl'.`);
        } else if (baseUrl.charAt(0) !== '/') {
            throw new errors.InvalidBaseUrl(`'baseUrl' must start with '/'.`);
        }

        this.router = router();
        this.baseUrl = baseUrl;
    }

    use(routesInfo) {
        this.router.use(routesInfo.baseUrl, routesInfo.router);
    }

    route(name, subPath) {
        if (_ROUTES[name]) {
            throw new errors.DuplicateNameError(`Route named '${name}' already defined for '${_ROUTES[name].pathname}'.`);
        }

        const pathname = `${this.baseUrl}${subPath}`.replace(/\/\//g, '/');

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

module.exports = RoutesInfo;
