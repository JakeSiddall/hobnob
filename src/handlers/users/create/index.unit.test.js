import assert from 'assert';
import { spy, stub } from 'sinon';
import ValidationError from '../../../validators/errors/validation-error';
import createUser from '.';

const generateCreateStubs = () => ({
    success: stub().resolves({ _id: 'foo'}),
    validationError: stub().rejects(new ValidationError('VALIDATION_ERROR_MESSAGE')),
    genericError: stub().rejects(new Error('Internal Server Error')),
});

describe('createUser', function() {
    let res;
    let create;
    const req = {};
    const db = {};

    beforeEach(function() {
        return res = {
            status: spy(),
            set: spy(),
            json: spy(),
            send: spy(),
        }
    });

    describe("When create resolves with the new user's ID", function() {
        beforeEach(function () {
            create = generateCreateStubs().success;
            return createUser(req, res, db, create, ValidationError);
        });
        describe('should call res.status()', function() {
            it('once', function () {
                assert(res.status.calledOnce);
            });
            it('with the argument 201', function() {
                assert(res.status.calledWithExactly(201));
            });
        });

        describe('should call res.set()', function() {
            it('once', function() {
                assert(res.set.calledOnce);
            });
            it('with the arguments "Content-Type" and "text/plain"', function () {
                assert(res.set.calledWithExactly('Content-Type','text/plain'));
            });
        });

        describe('should call res.send()', function() {
            it('once', function() {
                assert(res.send.calledOnce);
            });
            it("with the new user's ID", function() {
                assert(res.send.calledWithExactly('foo'));
            });
        });
    });

    describe("When create rejects with an instance of ValidationError", function() {
        beforeEach(function () {
            create = generateCreateStubs().validationError;
            return createUser(req, res, db, create, ValidationError);
        });
        describe('should call res.status()', function() {
            it('once', function () {
                assert(res.status.calledOnce);
            });
            it('with the argument 400', function() {
                assert(res.status.calledWithExactly(400));
            });
        });

        describe('should call res.set()', function() {
            it('once', function() {
                assert(res.set.calledOnce);
            });
            it('with the arguments "Content-Type" and "application/json"', function () {
                assert(res.set.calledWithExactly('Content-Type','application/json'));
            });
        });

        describe('should call res.json()', function() {
            it('once', function() {
                assert(res.json.calledOnce);
            });
            it("with a validation error object", function() {
                assert(res.json.calledWithExactly({message: 'VALIDATION_ERROR_MESSAGE'}));
            });
        });
    });

    describe("When create rejects with an instance of Error", function() {
        it('should call res.status once', function() {
            create = generateCreateStubs().genericError;
            return createUser(req, res, db, create, ValidationError)
                .catch(actualError => assert(res.status.calledOnce))
        });

        it('should call res.status with the argument 500', function() {
            create = generateCreateStubs().genericError;
            return createUser(req, res, db, create, ValidationError)
                .catch(actualError => assert(res.status.calledWithExactly(500)))
        });

        it('should call res.set once', function() {
            create = generateCreateStubs().genericError;
            return createUser(req, res, db, create, ValidationError)
                .catch(actualError => assert(res.set.calledOnce))
        });

        it('should call res.set with the arguments "Content-Type" and "application/json"', function() {
            create = generateCreateStubs().genericError;
            return createUser(req, res, db, create, ValidationError)
                .catch(actualError => assert(res.status.calledWithExactly('Content-Type','application/json')))
        });

        it('should call res.json() once', function() {
            create = generateCreateStubs().genericError;
            return createUser(req, res, db, create, ValidationError)
                .catch(actualError => assert(res.json.calledOnce))
        });
        
        it('should call res.json() with a validation error object', function() {
            create = generateCreateStubs().genericError;
            return createUser(req, res, db, create, ValidationError)
                .catch(actualError => assert(actualError, 'Internal Server Error'))
        });
    });
});