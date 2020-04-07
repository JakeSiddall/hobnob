import ValidationError from '../../validators/errors/validation-error';
import create from '../../engines/users/create';

function createUser(req, res, db) {
  create(req,db).then((result) => {
    res.status(201);
    res.set('Content-Type', 'text/plain');
    res.send(result._id);
  }, (err) => {
    if (err instanceof ValidationError) {
      res.status(400);
      res.set('Content-Type', 'application/json');
      return res.json({message: err.message });
    }
    return undefined;
  }).catch(() => {
    res.status(500);
    res.set('Content-Type', 'application/json');
    return res.json({message: 'Internal Servor Error' });
  });
}

export default createUser;