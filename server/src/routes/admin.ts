import { Router } from 'express';
import AdminController from './../controllers/admin';
import Validation from './../validation/index';
import ifAdminExists from './../utils/isAdminExist';

const routes = Router();

routes.post('/signup',
  Validation.checkBodyContains('username', 'password'),
  Validation.trimsRequestBody,
  ifAdminExists,
  AdminController.createAdmin
);

routes.post('/login',
  Validation.checkBodyContains('username', 'password'),
  Validation.trimsRequestBody,
  AdminController.adminLogin
);

export default routes;
