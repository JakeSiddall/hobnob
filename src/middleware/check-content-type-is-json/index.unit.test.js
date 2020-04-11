import assert from 'assert';
import checkContentTypeIsJson from '.';
import deepEqual from 'lodash.isequal';
import deepClone from 'lodash.clonedeep';
import { spy, stub } from 'sinon';

describe('checkContentTypeIsJson', function() {
    let req;
    let res;
    let next;

    // IS JSON
    describe('When header content type is application/json', function() {
        let clonedRes;
        
        beforeEach(function () {
            req = {
                headers: {
                  'content-type': 'application/json; charset=utf-8',
                },
            };
            res = {};
            next = spy();
            clonedRes = deepClone(res);
            checkContentTypeIsJson(req, res, next);
        });
        
        it('should not modify res', function () {
            assert(deepEqual(res, clonedRes));
        });
        
        it('should call next() once', function () {
            assert(next.calledOnce);
        });
    });

    // IS NOT JSON
    describe('When header content type is not application/json', function() {
        let resJsonReturnValue;
        let returnedValue;


        beforeEach(function() {
            req = {
                headers: {
                    'content-type': 'text/plain',
                },
            };
            resJsonReturnValue = {};
            res = {
                status: spy(),
                set: spy(),
                json: stub().returns(resJsonReturnValue),
              };
            next = spy();
            returnedValue = checkContentTypeIsJson(req, res, next);
        });
        
        describe('should call res.status()', function () {
            it('once', function () {
                assert(res.status.calledOnce);
            });
            it('with the argument 415', function () {
                assert(res.status.calledWithExactly(415));
            });
        });

        describe('should call res.set()', function () {
            it('once', function () {
                assert(res.set.calledOnce);
            });
            it('with the arguments "Content-Type" and "application/json"', function () {
                assert(res.set.calledWithExactly('Content-Type', 'application/json'));
            });
        });

        describe('should call res.json()', function () {
            it('once', function () {
                assert(res.json.calledOnce);
            });
            it('with the correct error object', function () {
                assert(res.json.calledWithExactly({ message: 'The "Content-Type" header must always be "application/json"' }));
            });
        });

        it('should return whatever res.json() returns', function () {
            assert.equal(returnedValue, resJsonReturnValue);
          });

        it('should not call next()', function () {
            assert(next.notCalled);
        });


    });
});