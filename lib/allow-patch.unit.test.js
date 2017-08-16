const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./allow-patch');

const expect = testHelpers.expect;

describe("lib/allow-patch", () => {
    it("should expose a function with 1 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(1);
    });

    describe("middleware", () => {
        let middleware;
        let req;
        let res;
        let next;

        beforeEach(() => {
            middleware = moduleToTest('some/type');
            req = testHelpers.createRequest();
            res = testHelpers.createResponse();
            next = testHelpers.spy();
        });

        it("should set header 'Allow-Patch'", () => {
            middleware(req, res, next);

            expect(res._getHeaders()).to.have.property('Allow-Patch').to.equal('some/type');
            expect(next).to.have.been.called();
            expect(next).to.have.been.calledWith();
        });
    });
});
