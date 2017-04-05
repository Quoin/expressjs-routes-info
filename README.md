# ExpressJS Routes Info

This small library allows the user to define routes in an ExpressJS application
using routers, and enable them to reuse the routes to generate dynamic values.

The idea behind this library is to pass and construct the `req.baseUrl` value
statically.

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
