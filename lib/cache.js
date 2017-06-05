const _ = require('lodash');
const urlTemplate = require('url-template');

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
    return _.cloneDeep(CACHE);
};

cache.expand = (name, data) => {
    if (data) {
        return CACHE[name] ? CACHE[name].template.expand(data) : undefined;
    }
    return CACHE[name] ? CACHE[name].pathname : undefined;
};

// NOTE: This function is exported, but really is only useful for tests.
cache.reset = () => {
    _.forEach(CACHE, (value, key) => {
        delete CACHE[key];
    });
};

module.exports = cache;
