const urlTemplatePath = require('./url-template-path');

module.exports = (pathname) => {
    return urlTemplatePath(pathname.replace(/\/+/g, '/').replace(/\/$/, '') || '/');
};
