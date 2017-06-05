const url = require('url');

module.exports = (path) => {
    return url.parse(path).pathname.replace(/{([\w]+)}/g, ':$1').replace(/{$/, '');
};
