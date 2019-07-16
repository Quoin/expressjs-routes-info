const MAILTO = /^mailto:(.*)$/;

module.exports = (path) => {
    const matchMailto = path.match(MAILTO);

    let prefix = '';
    if (matchMailto) {
        prefix = 'mailto:';
        path = matchMailto[1];
    }
    return prefix + path.replace(/:([a-zA-Z_][\w]*)/g, '{$1}');
};
