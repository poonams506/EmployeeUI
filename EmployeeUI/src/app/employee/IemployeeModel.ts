export interface Employee {
  id: string;
  employCode: number;
  name: string;
  dob: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  isDeleted: boolean;
  department:string;
  employeeNetworkIps: EmployeeNetworkIp[];
}

export interface EmployeeNetworkIp {
  id: string;
  employeeId: string;
  ipAddress: string;
}
