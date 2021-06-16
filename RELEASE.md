# Releases

## 1.0.0-rc.1 - 2021-06-16

- Updating node@14

## 0.2.3 - 2021-06-10

- Bumped lodash for CVE-2021-23337.

## 0.2.2 - 2019-07-12

- Added `RoutesInfo.externalUrl(name, url)`.
- Added `req` as third param to `RoutesInfo.expand()`.
- Lodash CVE-2019-10744

## 0.2.1 - 2018-12-12

- Updated to node8.
- Updated dependencies (`npm outdated`).
- Fixed deprecated `url.parse()` call.


## 0.2.0 - 2017-12-18

- Modified `staticPath()` to not include the `baseUrl`.

## 0.1.10 - 2017-08-16

- Adding options to `.route()` to define `Allow-Patch` header.

## 0.1.9 - 2017-08-15

- Adding most of HTTP request method, except `connect` to routes.

## 0.1.8 - 2017-06-03

- Adding 'implementations' param to `route()`.
- Adding `staticPath()`.

## 0.1.7 - 2017-06-05

- Splitting code into more modules.
- Added more tests.

## 0.1.6 - 2017-05-02

- Adding `.reset()` to allow clearing the cached routes.

## 0.1.5 - 2017-04-11

- Support for query string in path.

## 0.1.4 - 2017-04-10

- Added support for middlewares in `.use()`.

## 0.1.3 - 2017-04-05

- Removed a `console.log()`.

## 0.1.2 - 2017-04-05

- uri-template notation. Path can now be in the format: `/some/{type}`.

## 0.1.1 - 2017-04-05

- Handling sub-routers.

## 0.1.0

- Initial release
