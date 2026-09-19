import { Database } from 'better-sqlite3';
import { Student, CreateStudentDTO, UpdateStudentDTO } from '../types';

export class StudentModel {
  constructor(private db: Database) {}

  findAll(department?: string, year?: number): Student[] {
    let query = 'SELECT * FROM students WHERE 1=1';
    const params: any[] = [];

    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }
    if (year) {
      query += ' AND year = ?';
      params.push(year);
    }

    const stmt = this.db.prepare(query);
    return stmt.all(...params) as Student[];
  }

  findById(id: number): Student | undefined {
    const stmt = this.db.prepare('SELECT * FROM students WHERE id = ?');
    return stmt.get(id) as Student | undefined;
  }

  findByRollNumber(rollNumber: string): Student | undefined {
    const stmt = this.db.prepare('SELECT * FROM students WHERE rollNumber = ?');
    return stmt.get(rollNumber) as Student | undefined;
  }

  create(student: CreateStudentDTO): Student {
    const stmt = this.db.prepare(
      'INSERT INTO students (name, rollNumber, department, year) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(student.name, student.rollNumber, student.department, student.year);
    return this.findById(result.lastInsertRowid as number) as Student;
  }

  update(id: number, student: UpdateStudentDTO): Student | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];

    if (student.name !== undefined) {
      updates.push('name = ?');
      params.push(student.name);
    }
    if (student.rollNumber !== undefined) {
      updates.push('rollNumber = ?');
      params.push(student.rollNumber);
    }
    if (student.department !== undefined) {
      updates.push('department = ?');
      params.push(student.department);
    }
    if (student.year !== undefined) {
      updates.push('year = ?');
      params.push(student.year);
    }

    if (updates.length === 0) return existing;

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    params.push(id);

    const stmt = this.db.prepare(
      `UPDATE students SET ${updates.join(', ')} WHERE id = ?`
    );
    stmt.run(...params);

    return this.findById(id) as Student;
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM students WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
