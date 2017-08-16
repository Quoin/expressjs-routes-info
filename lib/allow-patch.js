module.exports = (types) => (req, res, next) => {
    res.header('Allow-Patch', types);
    next();
};
