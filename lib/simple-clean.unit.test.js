const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./simple-clean');

const expect = testHelpers.expect;

describe("lib/simple-clean", () => {
    it("should expose a function with 1 param", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(1);
    });

    it("should replace empty string with '/'", () => {
        const value = moduleToTest('');
        expect(value).to.equal('/');
    });

    it("should clean double-slash path", () => {
        const value = moduleToTest('/i/have//two//slashes');
        expect(value).to.equal('/i/have/two/slashes');
    });

    it("should remove ending slash", () => {
        const value = moduleToTest('/i/have/ending/slash/');
        expect(value).to.equal('/i/have/ending/slash');
    });

    context("with protocol", () => {
        context("mailto:", () => {
            it("should support basic 'mailto:'", () => {
                const value = moduleToTest('mailto:hello@some.one');
                expect(value).to.equal('mailto:hello@some.one');
            });
        });

        context("http://", () => {
            it("should support 'http://'", () => {
                const value = moduleToTest('http://some.host/some/path');
                expect(value).to.equal('http://some.host/some/path');
            });
        });
    });
});
