const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./errors');

const expect = testHelpers.expect;

describe("lib/errors", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    it("should expose known properties", () => {
        const clone = _.clone(moduleToTest);

        testHelpers.verifyProperties(clone, 'function', [
            'RoutesInfoError',
            'DuplicateNameError',
            'InvalidBaseUrl',
            'MissingArgument'
        ]);

        expect(clone).to.deep.equal({});
    });

    describe("RoutesInfoError", () => {
        const RoutesInfoError = moduleToTest.RoutesInfoError;

        it("should be a class", () => {
            expect(RoutesInfoError).to.have.property('name').to.equal('RoutesInfoError');
        });
    });

    describe("DuplicateNameError", () => {
        const DuplicateNameError = moduleToTest.DuplicateNameError;

        it("should be a class", () => {
            expect(DuplicateNameError).to.have.property('name').to.equal('DuplicateNameError');
        });
    });

    describe("InvalidBaseUrl", () => {
        const InvalidBaseUrl = moduleToTest.InvalidBaseUrl;

        it("should be a class", () => {
            expect(InvalidBaseUrl).to.have.property('name').to.equal('InvalidBaseUrl');
        });
    });

    describe("MissingArgument", () => {
        const MissingArgument = moduleToTest.MissingArgument;

        it("should be a class", () => {
            expect(MissingArgument).to.have.property('name').to.equal('MissingArgument');
        });
    });
});
