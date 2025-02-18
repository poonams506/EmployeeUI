export interface Employee {
    id: string;
    name: string;
    department: string;
    isDeleted: boolean;
  }
  
  export interface EmployeeDetail {
    id: string;
    name: string;
    department: string;
    employeeId:string;
    isDeleted: boolean;

  }
  
  export interface CreateEmployeeDetailDto {
    employeeId: string;
    name: string;
    department: string;
  }
  
  export interface UpdateEmployeeDetailDto {
    id: string;
    name: string;
    department: string;
  }
  