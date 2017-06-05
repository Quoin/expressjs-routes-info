const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./url-template-path');

const expect = testHelpers.expect;

describe("lib/url-template-path", () => {
    it("should expose a function with 1 param", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(1);
    });

    it("should not change when no params", () => {
        const value = moduleToTest('/a/path');
        expect(value).to.equal('/a/path');
    });

    it("should not change a non-express param", () => {
        const value = moduleToTest('/a/{path}');
        expect(value).to.equal('/a/{path}');
    });

    it("should change express param", () => {
        const value = moduleToTest('/a/:path');
        expect(value).to.equal('/a/{path}');
    });

    it("should change when more than one express param", () => {
        const value = moduleToTest('/a/:path/with/:three/:params');
        expect(value).to.equal('/a/{path}/with/{three}/{params}');
    });
});
