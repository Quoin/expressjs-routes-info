# ExpressJS Routes Info

This small library tries to help implementing
[rfc6570](https://tools.ietf.org/html/rfc6570) as route path in expressJS. It is
far from implementing the whole RFC6570, but is a good starting point to be able
to define basic routes this way.

It allows the user to define routes in an ExpressJS application
using routers, and enable them to reuse the routes to generate dynamic values.
The idea behind this library is to pass and construct the `req.baseUrl` value
statically. This value is only available for the current router at runtime, and
reconstructing the path from the generated regexp is quite tedious.

## Usage

In your `server/app.js`:

```javascript
const routesInfo = require('./routes-info');

const app = express();

app.use(routesInfo('/something', '/').router);
```

In your `server/routes-info.js`:

```javascript
const RoutesInfo = require('@quoin/expressjs-routes-info');

const homepageRoutesInfo = require('./homepage').routesInfo;
const mapRoutesInfo = require('./map').routesInfo;

module.exports = (subPath, baseUrl) => {
    const routesInfo = new RoutesInfo(subPath, baseUrl);
    const prefix = `${baseUrl}/${subPath}`;

    routesInfo.use(homepageRoutesInfo('/', prefix));
    routesInfo.use(mapRoutesInfo('/map', prefix));

    return routesInfo;
};
```

In your `server/map/routes-info.js`:

```javascript
const RoutesInfo = require('@quoin/expressjs-routes-info');

const controllers = require('./controllers');

module.exports = (subPath, baseUrl) => {
    const routesInfo = new RoutesInfo(subPath, baseUrl);

    routesInfo.route('map', '/{id}')
        .get(controllers.index);

    return routesInfo;
};
```

or you can also use the express notation:

```javascript
    routesInfo.route('map', '/:id')
        .get(controllers.index);
```

The route will also accept querystring:

```javascript
    // Not RFC6570
    routesInfo.route('pageView', '/pageView/{domain}?pv={id}')
        .get(controllers.index);

    // RFC6570
    routesInfo.route('pageView', '/pageView/{domain}{?pv}')
        .get(controllers.index);
```

The difference between the two is what variable name will be used during the
`.expand()` call. We would agree that the query param should have been `id`,
instead of `pv`, but this is to demonstrate the options.


Your `controllers.index` would just be a normal controller with a signature as:

```javascript
function index(req, res) {
    ...
    res.status(200).send();
}
```

With this new library, you can now generate the URL dynamically:

```javascript
const RoutesInfo = require('@quoin/expressjs-routes-info');

console.log(RoutesInfo.expand('map', {id: '0xABCDEF'}));
// /something/map/0xABCDEF
```

## Reset

This should not be needed for normal operation, but was added to allow testing
of code that depends on this library.

```javascript

const routesInfoCache = require('@quoin/expressjs-routes-info/lib/cache');

describe("", () => {
    beforeEach(() => {
        routesInfoCache.reset();
    });

    afterEach(() => {
        routesInfoCache.reset();
    });
});
```
