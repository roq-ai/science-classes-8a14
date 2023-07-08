import { StudentInterface } from 'interfaces/student';
import { GetQueryInterface } from 'interfaces';

export interface ParentInterface {
  id?: string;
  login_details: string;
  student_id?: string;
  created_at?: any;
  updated_at?: any;
  student_student_parent_idToparent?: StudentInterface[];
  student_parent_student_idTostudent?: StudentInterface;
  _count?: {
    student_student_parent_idToparent?: number;
  };
}

export interface ParentGetQueryInterface extends GetQueryInterface {
  id?: string;
  login_details?: string;
  student_id?: string;
}
