const cloneDeep = require('lodash/cloneDeep');
const forEach = require('lodash/forEach');
const url = require('url');
const urlTemplate = require('url-template');

// const debug = require('./debug')('cache');
const errors = require('./errors');
const urlTemplatePath = require('./url-template-path');

const CACHE = {};

function cache(name, pathname) {
    if (!pathname) {
        return CACHE[name];
    }

    if (CACHE[name]) {
        throw new errors.DuplicateNameError(`Route named '${name}' already defined for '${CACHE[name].pathname}'.`);
    }

    CACHE[name] = {
        name,
        pathname,
        template: urlTemplate.parse(urlTemplatePath(pathname))
    };
}

cache.all = () => {
    return cloneDeep(CACHE);
};

cache.expand = (name, data, req) => {
    const path = data
        ? CACHE[name] ? CACHE[name].template.expand(data) : undefined
        : CACHE[name] ? CACHE[name].pathname : undefined
    ;

    if (req) {
        // If a req object is passed in, we want a URI relative to the current
        // page.
        const hostname = req.get('x-forwarded-host') || req.get('host');
        const proto = req.get('x-forwarded-proto') || req.protocol;
        const currentUrl = new url.URL(`${proto}://${hostname}${req.originalUrl}`);
        const newUrl = new url.URL(path, currentUrl);
        return newUrl.toString();
    } else {
        return path;
    }
};

// NOTE: This function is exported, but really is only useful for tests.
cache.reset = () => {
    forEach(CACHE, (value, key) => {
        delete CACHE[key];
    });
};

module.exports = cache;
