const urlTemplatePath = require('./url-template-path');

module.exports = (pathname) => {
    // With external URL, let's list the one we accept (special processing):
    //  - http://
    //  - https://
    //  - ftp://
    let prefix = '';

    const WEB_OR_FTP = /^((ftp|https?):\/\/)(.*)$/;

    const matchWebOrFtp = pathname.match(WEB_OR_FTP);
    if (matchWebOrFtp) {
        prefix = matchWebOrFtp[1];
        pathname = matchWebOrFtp[3];
    }

    return urlTemplatePath(prefix + pathname.replace(/\/+/g, '/').replace(/\/$/, '') || '/');
};
