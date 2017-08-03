const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./static-path');

const expect = testHelpers.expect;

describe("lib/static-path", () => {
    it("should expose a function with 5 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(5);
    });

    it("should throw when no params", () => {
        expect(() => moduleToTest()).to.throw();
    });
});
