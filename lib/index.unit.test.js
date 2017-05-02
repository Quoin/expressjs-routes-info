const testHelpers = require('@quoin/node-test-helpers');

const errors = require('./errors');
const ModuleToTest = require('./index');

const expect = testHelpers.expect;

describe("lib/index", () => {
    beforeEach(() => {
        ModuleToTest.reset();
    });
    afterEach(() => {
        ModuleToTest.reset();
    });

    it("should expose a class", () => {
        expect(ModuleToTest).to.have.property('name').to.equal('RoutesInfo');
    });

    it("should accept 2 params", () => {
        expect(ModuleToTest).to.have.lengthOf(2);
    });

    describe("constructor", () => {
        it("should expect subPath to be passed", () => {
            expect(() => new ModuleToTest()).to.throw(errors.MissingArgument, "Missing argument 'subPath'.");
        });

        it("should fail if 'baseUrl' doesn't start with '/'", () => {
            expect(() => new ModuleToTest('foo')).to.throw(errors.InvalidValue, "'subPath' must start with '/'.");
        });

        it("should expect 'prefix' to be passed", () => {
            expect(() => new ModuleToTest('/foo')).to.throw(errors.MissingArgument, "Missing argument 'prefix'.");
        });

        it("should expect 'prefix' to start with '/'", () => {
            expect(() => new ModuleToTest('/foo', 'bar')).to.throw(errors.InvalidValue, "'prefix' must start with '/'.");
        });

        it("should not fail if 'baseUrl' starts with '/'", () => {
            expect(() => new ModuleToTest('/foo', '/bar')).not.to.throw();
        });
    });

    describe(".expand()", () => {
        it("should expose static method '.expand()' with 2 params", () => {
            expect(ModuleToTest.expand).to.be.a('function').to.have.lengthOf(2);
        });

        it("should expand a route with no variable", () => {
            const routeName = 'test-route-expand-1';
            const routesInfo = new ModuleToTest('/foo', '/bar');
            routesInfo.route(routeName, '/hello/world');

            expect(ModuleToTest.expand(routeName)).to.equal('/bar/foo/hello/world');
        });

        it("should expand a route with a variable and value", () => {
            const routeName = 'test-route-expand-2';
            const routesInfo = new ModuleToTest('/foo', '/bar');
            routesInfo.route(routeName, '/hello/{world}');

            const value = ModuleToTest.expand(routeName, {world: 'foobar'});
            expect(value).to.equal('/bar/foo/hello/foobar');
        });

        it("should expand a route with a variable and no value", () => {
            const routeName = 'test-route-expand-3';
            const routesInfo = new ModuleToTest('/foo', '/bar');
            routesInfo.route(routeName, '/hello/{world}');

            const value = ModuleToTest.expand(routeName, {notWorld: 'foobar'});
            expect(value).to.equal('/bar/foo/hello/');
        });
    });

    describe(".all()", () => {
        it("should expose static method '.all()' with no params", () => {
            expect(ModuleToTest.all).to.be.a('function').to.have.lengthOf(0);
        });

        it("should return an object", () => {
            expect(ModuleToTest.all()).to.be.an('object');
        });
    });

    describe(".reset()", () => {
        it("should expose static method '.reset()' with no params", () => {
            expect(ModuleToTest.reset).to.be.a('function').to.have.lengthOf(0);
        });

        it("should empty routes", () => {
            const routeName = 'test-route-reset-1';
            const routesInfo = new ModuleToTest('/foo', '/bar');
            routesInfo.route(routeName, '/hello/{world}');

            expect(ModuleToTest.all()).not.to.be.empty();
            ModuleToTest.reset();
            expect(ModuleToTest.all()).to.be.empty();
        });
    });
});
