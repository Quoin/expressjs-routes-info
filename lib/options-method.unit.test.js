const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./options-method');

const expect = testHelpers.expect;

describe("lib/options-method", () => {
    let req;
    let res;

    beforeEach(() => {
        req = testHelpers.createRequest();
        req.route = {
            methods: {}
        };
        res = testHelpers.createResponse();
        testHelpers.spy(res, 'status');
        testHelpers.spy(res, 'send');
    });

    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(2);
    });

    it("should return empty when no modules", () => {
        moduleToTest(req, res);

        expect(res.status).to.have.been.calledWith(200);
        expect(res.send).to.have.been.calledWith('');
    });

    it("should return 1 method when only 1 is defined", () => {
        req.route.methods = {get: true};
        moduleToTest(req, res);

        expect(res.status).to.have.been.calledWith(200);
        expect(res.send).to.have.been.calledWith('GET');
    });

    it("should sort methods when more than 1 defined", () => {
        req.route.methods = {post: true, get: true};
        moduleToTest(req, res);

        expect(res.status).to.have.been.calledWith(200);
        expect(res.send).to.have.been.calledWith('GET,POST');
    });
});
