const testHelpers = require('@quoin/node-test-helpers');

const cache = require('./cache');
const moduleToTest = require('./static-path');

const expect = testHelpers.expect;

const app = {
    use(path, middleware) {
    }
};

const sandbox = testHelpers.createSandbox();

describe("lib/static-path", () => {
    beforeEach(() => {
        sandbox.stub(app, 'use');
        cache.reset();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should expose a function with 5 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(5);
    });

    it("should throw when no params", () => {
        expect(() => moduleToTest()).to.throw();
    });

    context("calling", () => {
        it("should handle baseUrl=/", () => {
            moduleToTest('a-name', app, '/', '/url-path', '/a-folder');
        });

        it("should call app.use() with appropriate parameters", () => {
            moduleToTest('a-name', app, '/baseUrl', '/url-path', '/a-folder');
            expect(app.use).has.been.calledOnce();

            const args = app.use.getCall(0).args;
            expect(args[0]).to.equal('/url-path');
        });
    });
});
