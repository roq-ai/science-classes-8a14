import { ParentInterface } from 'interfaces/parent';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface StudentInterface {
  id?: string;
  name: string;
  address: string;
  class: string;
  fees: number;
  marks: number;
  parent_id?: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  parent_parent_student_idTostudent?: ParentInterface[];
  parent_student_parent_idToparent?: ParentInterface;
  organization?: OrganizationInterface;
  _count?: {
    parent_parent_student_idTostudent?: number;
  };
}

export interface StudentGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  address?: string;
  class?: string;
  parent_id?: string;
  organization_id?: string;
}
