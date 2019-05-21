const cache = require('./cache');
const simpleClean = require('./simple-clean');

module.exports = (name, url) => {
    const sanitized = simpleClean(url);
    cache(name, sanitized);
};
