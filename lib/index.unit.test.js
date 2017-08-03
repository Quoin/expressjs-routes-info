const testHelpers = require('@quoin/node-test-helpers');

const cache = require('./cache');
const errors = require('./errors');
const ModuleToTest = require('./index');

const expect = testHelpers.expect;

describe("lib/index", () => {
    beforeEach(() => {
        cache.reset();
    });
    afterEach(() => {
        cache.reset();
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

        it("should expect 'baseUrl' to be passed", () => {
            expect(() => new ModuleToTest('/foo')).to.throw(errors.MissingArgument, "Missing argument 'baseUrl'.");
        });

        it("should expect 'baseUrl' to start with '/'", () => {
            expect(() => new ModuleToTest('/foo', 'bar')).to.throw(errors.InvalidValue, "'baseUrl' must start with '/'.");
        });

        it("should not fail if 'baseUrl' starts with '/'", () => {
            expect(() => new ModuleToTest('/foo', '/bar')).not.to.throw();
        });
    });

    it("should expose static method '.expand()' with 2 params", () => {
        expect(ModuleToTest.expand).to.be.a('function').to.have.lengthOf(2);
    });

    it("should expose static method '.all()' with no params", () => {
        expect(ModuleToTest.all).to.be.a('function').to.have.lengthOf(0);
    });

    it("should expose static method '.staticPath()' with 5 params", () => {
        expect(ModuleToTest.staticPath).to.be.a('function').to.have.lengthOf(5);
    });
});
