const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./debug');

const expect = testHelpers.expect;

describe("lib/debug", () => {
    it("should expose a function with 1 param", () => {
        expect(moduleToTest).to.be.a('function').and.to.have.lengthOf(1);
    });

    it("should return a function when called", () => {
        const debug = moduleToTest('foo');
        expect(debug).to.be.a('function');
    });
});
