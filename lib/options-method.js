const _ = require('lodash');

module.exports = (req, res) => {
    const methods = _.keys(req.route.methods).map((key) => key.toUpperCase());
    methods.sort();
    res.status(200).send(methods.join(','));
};
