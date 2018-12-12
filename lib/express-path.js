const PARAM_RE = /{([\w]+)}/g;
const REMAIN_RE = /{.*$/;

module.exports = (path) => {
    return path.replace(PARAM_RE, ':$1').replace(REMAIN_RE, '');
};
