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
const routesInfo = require('./routes');

const app = express();

app.use(routesInfo('/something', '/').router);
```

In your `server/routes.js`:

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

In your `server/map/routes.js`:

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

You can alternatively pass in an implementations object: (new in 0.1.8)


### .route(routeName, routePath, [implementations, [options]])


#### .route(routeName, routePath)

The basic usage will return the expressJS route instance and all methods can
then be added as you would normally do after defining `.route()`.

```javascript
    routesInfo.route('route-name', '/path/{param}')
        .get(...)
        .post(...)
```


#### .route(routeName, routePath, implementations)

Object that is defined as:

```javascript
    implementations = Object.freeze({
        get: getImplementation,
        post: postImplementation,
        ...
    });

    routesInfo.route('route-name', '/path/{param}', implementations);
```

and the library will extract `all` and the
[HTTP request methods](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods)
(beside `connect`), and assign them to the route for that specific method.


#### .route(routeName, routePath, implementations, options)

```javascript
    options = {
        allowPatch: 'application/json',
        ...
    };
```

This signature is just a quick way to add the `Allow-Patch` header if the
`patch` implementation is defined to all methods.


### .expand(routeName, routeParams, [req])

With this new library, you can now generate the URL dynamically:

```javascript
const RoutesInfo = require('@quoin/expressjs-routes-info');

console.log(RoutesInfo.expand('map', {id: '0xABCDEF'}));
// /something/map/0xABCDEF
```

When passing `req` as the optional third argument, the URL should be generated
as a full URI (containing the hostname):

```javascript
console.log(RoutesInfo.expand('map', {id: '0xABCDEF'}, req));
// https://your-host:port/something/map/0xABCDEF
```


### RoutesInfo.staticPath(name, app, baseUrl, urlPath, folderPath)

Add a named static path to the `app`. Approximatively equivalent to:

```javascript
    app.use(`${baseUrl}/${urlPath}`, express.static(folderPath));
```


### RoutesInfo.externalUrl(name, url)

Add a route to an external URL. This will not try to add a route to your
application.

```javascript
    > RoutesInfo.externalUrl('hello:world', 'http://external.host/foo/bar/{sub}{?param1,param2}');
    > RoutesInfo.expand('hello:world', { sub: 'foobar', param2:'value2' });
    'http:/external.host/foo/bar/foobar?param2=value2'
```

This is not intended to support `mailto:`, so use at your own risk.


## Debugging

To enable debugging message, define

    DEBUG=Quoin:expressjs-routes-info:*


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
