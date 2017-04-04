const testHelpers = require('@quoin/node-test-helpers');

const errors = require('./errors');
const ModuleToTest = require('./index');

const expect = testHelpers.expect;

describe("lib/index", () => {
    it("should expose a class", () => {
        expect(ModuleToTest).to.have.property('name').to.equal('RoutesInfo');
    });

    it("should accept 1 param", () => {
        expect(ModuleToTest).to.have.lengthOf(1);
    });

    describe("constructor", () => {
        it("should expect baseUrl to be passed", () => {
            expect(() => new ModuleToTest()).to.throw(errors.MissingArgument, `Missing argument 'baseUrl'.`);
        });

        it("should fail if 'baseUrl' doesn't start with '/'", () => {
            expect(() => new ModuleToTest('foo')).to.throw(errors.InvalidBaseUrl, `'baseUrl' must start with '/'.`);
        });

        it("should not fail if 'baseUrl' starts with '/'", () => {
            expect(() => new ModuleToTest('/foo')).not.to.throw();
        });
    });

    describe(".expand()", () => {
        it("should expose static method '.expand()' with 2 params", () => {
            expect(ModuleToTest.expand).to.be.a('function').to.have.lengthOf(2);
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
});
