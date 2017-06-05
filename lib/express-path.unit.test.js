const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./express-path');

const expect = testHelpers.expect;

describe("lib/express-path", () => {
    it("should expose a function with 1 param", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(1);
    });

    it("should return non-variable path", () => {
        const value = moduleToTest('/some/path');
        expect(value).to.equal('/some/path');
    });

    it("should return a variable path", () => {
        const value = moduleToTest('/some/{path}');
        expect(value).to.equal('/some/:path');
    });

    it("should return a query string path", () => {
        const value = moduleToTest('/some{?queryString}');
        expect(value).to.equal('/some');
    });

    it("should return a variable and query string path", () => {
        const value = moduleToTest('/some/{path}{?queryString}');
        expect(value).to.equal('/some/:path');
    });
});
