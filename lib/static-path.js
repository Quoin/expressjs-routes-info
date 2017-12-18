const express = require('express');

const cache = require('./cache');
const expressPath = require('./express-path');
const simpleClean = require('./simple-clean');

module.exports = (name, app, baseUrl, urlPath, folderPath) => {
    baseUrl = (baseUrl === '/') ? '' : baseUrl;

    const sanitized = simpleClean(`${baseUrl}${urlPath}`);
    cache(name, sanitized);

    const cleanedUrlPath = simpleClean(urlPath);
    app.use(expressPath(cleanedUrlPath), express.static(folderPath));
};
