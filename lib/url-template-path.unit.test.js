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

    context("protocol", () => {
        context("http", () => {
            it("should accept basic http host", () => {
                const value = moduleToTest('http://foo.bar');
                expect(value).to.equal('http://foo.bar');
            });

            it("should accept basic http with path", () => {
                const value = moduleToTest('http://foo.bar/some/path');
                expect(value).to.equal('http://foo.bar/some/path');
            });

            it("should accept a numeric port http port", () => {
                const value = moduleToTest('http://foo.bar:8888/');
                expect(value).to.equal('http://foo.bar:8888/');
            });

            it("should accept a param", () => {
                const value = moduleToTest('http://some.host:8888/some/:id');
                expect(value).to.equal('http://some.host:8888/some/{id}');
            });
        });

        context("mailto", () => {
            it("should accept basic mailto", () => {
                const value = moduleToTest('mailto:some.one@some.where');
                expect(value).to.equal('mailto:some.one@some.where');
            });
        });
    });
});
