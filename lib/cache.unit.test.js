const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./cache');

const expect = testHelpers.expect;

describe("lib/cache", () => {
    const routeName = 'a-route-name';

    beforeEach(() => {
        moduleToTest.reset();
    });

    afterEach(() => {
        moduleToTest.reset();
    });

    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(2);
    });

    it("should return a value cached", () => {
        moduleToTest(routeName, '/a/path');
        const value = moduleToTest(routeName);

        expect(value).to.have.property('name');
        expect(value.name).to.equal(routeName);

        expect(value).to.have.property('pathname');
        expect(value.pathname).to.equal('/a/path');
    });

    it("should detect a duplicate name", () => {
        moduleToTest(routeName, '/a/path');
        expect(() => moduleToTest(routeName, '/a/path')).to.throw();
    });

    describe(".all()", () => {
        it("should expose static method '.all()' with no params", () => {
            expect(moduleToTest.all).to.be.a('function').to.have.lengthOf(0);
        });

        it("should return an object", () => {
            expect(moduleToTest.all()).to.be.an('object');
        });
    });

    describe(".expand()", () => {
        it("should expose static method '.expand()' with 3 params", () => {
            expect(moduleToTest.expand).to.be.a('function').to.have.lengthOf(3);
        });

        it("should expand a route with no variable", () => {
            moduleToTest(routeName, '/hello/world');

            expect(moduleToTest.expand(routeName)).to.equal('/hello/world');
        });

        it("should expand a route with a variable and value", () => {
            moduleToTest(routeName, '/hello/{world}');

            const value = moduleToTest.expand(routeName, { world: 'foobar' });
            expect(value).to.equal('/hello/foobar');
        });

        it("should expand a route with a variable and no value", () => {
            moduleToTest(routeName, '/hello/{world}');

            const value = moduleToTest.expand(routeName, { notWorld: 'foobar' });
            expect(value).to.equal('/hello/');
        });

        it("should be undefined when route without data is unknown", () => {
            moduleToTest(routeName, '/hello/{world}');

            const value = moduleToTest.expand(`not-${routeName}`);
            expect(value).to.be.undefined();
        });

        it("should be undefined when route with data is unknown", () => {
            moduleToTest(routeName, '/hello/{world}');

            const value = moduleToTest.expand(`not-${routeName}`, { world: 'foobar' });
            expect(value).to.be.undefined();
        });

        it("should detect proxied 'req' and create URI", () => {
            const req = {
                get(header) {
                    switch (header.toLowerCase()) {
                        case 'x-forwarded-host':
                            return 'foo.com:8443';

                        case 'x-forwarded-proto':
                            return 'https';

                        default:
                            return undefined;
                    }
                },
                protocol: 'http',
                originalUrl: '/original/path'
            };

            moduleToTest(routeName, '/some/path/{id}');

            const value = moduleToTest.expand(routeName, { id: '123' }, req);
            expect(value).to.equal('https://foo.com:8443/some/path/123');
        });

        it("should detect non-proxied 'req' and create URI", () => {
            const req = {
                get(header) {
                    switch (header.toLowerCase()) {
                        case 'host':
                            return 'original.host:8080';
                    }
                },
                protocol: 'http',
                originalUrl: '/original/path'
            };

            moduleToTest(routeName, '/some/path/{id}');
            const value = moduleToTest.expand(routeName, { id: '123' }, req);
            expect(value).to.equal('http://original.host:8080/some/path/123');
        });
    });

    describe(".reset()", () => {
        it("should expose static method '.reset()' with no params", () => {
            expect(moduleToTest.reset).to.be.a('function').to.have.lengthOf(0);
        });

        it("should empty routes", () => {
            moduleToTest('test-route', '/some/path');

            expect(moduleToTest.all()).not.to.be.empty();
            moduleToTest.reset();
            expect(moduleToTest.all()).to.be.empty();
        });
    });
});
