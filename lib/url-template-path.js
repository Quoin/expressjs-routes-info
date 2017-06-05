
module.exports = (path) => {
    return path.replace(/:([\w]+)/g, '{$1}');
};
