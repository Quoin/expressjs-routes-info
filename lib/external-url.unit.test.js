const testHelpers = require('@quoin/node-test-helpers');

const cache = require('./cache');
const moduleToTest = require('./external-url');

const expect = testHelpers.expect;

describe("lib/external-url", () => {
    beforeEach(() => {
        cache.reset();
    });

    afterEach(() => {
        cache.reset();
    });

    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function').and.to.have.lengthOf(2);
    });

    context("expand() without values", () => {
        it("should return original route", () => {
            const ROUTE = 'http://just.some/path';
            moduleToTest('foo', ROUTE);
            const route = cache.expand('foo');
            expect(route).to.equal(ROUTE);
        });
    });
});
