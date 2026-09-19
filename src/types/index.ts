export interface Student {
  id: number;
  name: string;
  rollNumber: string;
  department: string;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentDTO {
  name: string;
  rollNumber: string;
  department: string;
  year: number;
}

export interface UpdateStudentDTO {
  name?: string;
  rollNumber?: string;
  department?: string;
  year?: number;
}
