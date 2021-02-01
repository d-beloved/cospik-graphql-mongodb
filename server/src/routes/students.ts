import { Router } from 'express';
import StudentController from './../controllers/student';
import Validation from './../validation/index';
import { authenticate } from './../utils/authStatus';
import ifStudentExists from '../utils/isStudentExist';

const routes = Router();

routes.post('/',
  authenticate,
  Validation.checkBodyContains('firstname', 'lastname', 'email'),
  Validation.trimsRequestBody,
  Validation.confirmEmail,
  ifStudentExists,
  StudentController.createStudent
);

routes.get('/',
  authenticate,
  StudentController.getAllStudents
);

routes.get('/:studentId',
  authenticate,
  StudentController.getStudent
);

routes.put('/:studentId',
  authenticate,
  Validation.trimsRequestBody,
  StudentController.updateStudent
);

routes.post('/enroll',
  authenticate,
  Validation.trimsRequestBody,
  StudentController.enrollStudentForCourse
)

routes.delete('/unenroll',
  authenticate,
  StudentController.removeCourseForStudent
)

export default routes;
