import { Request, Response, NextFunction } from 'express';
import { StudentModel } from '../models/studentModel';

export class StudentController {
  constructor(private studentModel: StudentModel) {}

  getAllStudents = (req: Request, res: Response, next: NextFunction) => {
    try {
      const department = req.query.department as string | undefined;
      const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;

      const students = this.studentModel.findAll(department, year);
      res.status(200).json(students);
    } catch (error) {
      next(error);
    }
  };

  getStudentById = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Validation failed', details: ['Invalid ID format'] });
        return;
      }

      const student = this.studentModel.findById(id);
      if (!student) {
        res.status(404).json({ error: 'Student not found', statusCode: 404 });
        return;
      }

      res.status(200).json(student);
    } catch (error) {
      next(error);
    }
  };

  createStudent = (req: Request, res: Response, next: NextFunction) => {
    try {
      const existing = this.studentModel.findByRollNumber(req.body.rollNumber);
      if (existing) {
        res.status(409).json({ error: 'Duplicate roll number', rollNumber: req.body.rollNumber, statusCode: 409 });
        return;
      }

      const newStudent = this.studentModel.create(req.body);
      res.status(201).json(newStudent);
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(409).json({ error: 'Duplicate roll number', rollNumber: req.body.rollNumber, statusCode: 409 });
        return;
      }
      next(error);
    }
  };

  updateStudent = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Validation failed', details: ['Invalid ID format'] });
        return;
      }

      if (req.body.rollNumber) {
        const existing = this.studentModel.findByRollNumber(req.body.rollNumber);
        if (existing && existing.id !== id) {
          res.status(409).json({ error: 'Duplicate roll number', rollNumber: req.body.rollNumber, statusCode: 409 });
          return;
        }
      }

      const updated = this.studentModel.update(id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Student not found', statusCode: 404 });
        return;
      }

      res.status(200).json(updated);
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(409).json({ error: 'Duplicate roll number', rollNumber: req.body.rollNumber, statusCode: 409 });
        return;
      }
      next(error);
    }
  };

  deleteStudent = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Validation failed', details: ['Invalid ID format'] });
        return;
      }

      const deleted = this.studentModel.delete(id);
      if (!deleted) {
        res.status(404).json({ error: 'Student not found', statusCode: 404 });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
