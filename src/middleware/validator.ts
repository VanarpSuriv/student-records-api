import { Request, Response, NextFunction } from 'express';
import { CreateStudentDTO, UpdateStudentDTO } from '../types';

export const validateStudentCreation = (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = [];
  const { name, rollNumber, department, year } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  } else if (name.trim().length > 100) {
    errors.push('Name cannot exceed 100 characters');
  }

  if (!rollNumber || typeof rollNumber !== 'string' || rollNumber.trim().length === 0) {
    errors.push('Roll number is required and must be a non-empty string');
  }

  if (!department || typeof department !== 'string' || department.trim().length === 0) {
    errors.push('Department is required and must be a non-empty string');
  } else if (department.trim().length > 100) {
    errors.push('Department cannot exceed 100 characters');
  }

  if (year === undefined || typeof year !== 'number' || !Number.isInteger(year) || year < 1 || year > 4) {
    errors.push('Year is required and must be an integer between 1 and 4');
  }

  if (errors.length > 0) {
    res.status(400).json({ error: 'Validation failed', details: errors });
    return;
  }

  req.body.name = name.trim();
  req.body.rollNumber = rollNumber.trim();
  req.body.department = department.trim();

  next();
};

export const validateStudentUpdate = (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = [];
  const { name, rollNumber, department, year } = req.body;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Name must be a non-empty string');
    } else if (name.trim().length > 100) {
      errors.push('Name cannot exceed 100 characters');
    } else {
      req.body.name = name.trim();
    }
  }

  if (rollNumber !== undefined) {
    if (typeof rollNumber !== 'string' || rollNumber.trim().length === 0) {
      errors.push('Roll number must be a non-empty string');
    } else {
      req.body.rollNumber = rollNumber.trim();
    }
  }

  if (department !== undefined) {
    if (typeof department !== 'string' || department.trim().length === 0) {
      errors.push('Department must be a non-empty string');
    } else if (department.trim().length > 100) {
      errors.push('Department cannot exceed 100 characters');
    } else {
      req.body.department = department.trim();
    }
  }

  if (year !== undefined) {
    if (typeof year !== 'number' || !Number.isInteger(year) || year < 1 || year > 4) {
      errors.push('Year must be an integer between 1 and 4');
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ error: 'Validation failed', details: errors });
    return;
  }

  next();
};
