import { Router } from 'express';
import admin from './admin';
import student from './students';
import courses from './courses'

const router = Router();

router.use('/auth', admin);
router.use('/student', student);
router.use('/course', courses)

export default router;
