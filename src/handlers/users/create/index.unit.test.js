import { stub } from 'sinon';
import ValidationError from '../../../validators/errors/validation-error';

const createStubs = {
  success: stub().resolves({ _id: 'foo'}),
  validationError: stub().rejects(new ValidationError()),
  otherError: stub().rejects(new Error()),
}