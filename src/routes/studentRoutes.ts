import { Router } from 'express';
import { StudentController } from '../controllers/studentController';
import { validateStudentCreation, validateStudentUpdate } from '../middleware/validator';

export const getStudentRoutes = (controller: StudentController): Router => {
  const router = Router();

  router.get('/', controller.getAllStudents);
  router.get('/:id', controller.getStudentById);
  router.post('/', validateStudentCreation, controller.createStudent);
  router.put('/:id', validateStudentUpdate, controller.updateStudent);
  router.delete('/:id', controller.deleteStudent);

  return router;
};
