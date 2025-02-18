import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importing Snackbar
import { Employee, EmployeeNetworkIp } from '../IemployeeModel';
import { City } from '../ICity';

@Component({
  selector: 'app-employee-grid-list',
  templateUrl: './employee-grid-list.component.html',
  styleUrls: ['./employee-grid-list.component.css']
})
export class EmployeeGridListComponent implements OnInit {
  employees: Employee[] = [];
  
  stateList = [
    { id: 'DL', name: 'Delhi' },
    { id: 'MH', name: 'Maharashtra' },
    { id: 'KA', name: 'Karnataka' }
  ];

  cityList = [
    { id: '1', stateId: 'DL', name: 'New Delhi' },
    { id: '2', stateId: 'DL', name: 'North Delhi' },
    { id: '3', stateId: 'DL', name: 'South Delhi' },
    { id: '4', stateId: 'DL', name: 'East Delhi' },
    { id: '5', stateId: 'DL', name: 'West Delhi' },
    { id: '6', stateId: 'MH', name: 'Mumbai' },
    { id: '7', stateId: 'MH', name: 'Pune' },
    { id: '8', stateId: 'MH', name: 'Nagpur' },
    { id: '9', stateId: 'MH', name: 'Nashik' },
    { id: '10', stateId: 'MH', name: 'Thane' },
    { id: '11', stateId: 'KA', name: 'Bangalore' },
    { id: '12', stateId: 'KA', name: 'Mysore' },
    { id: '13', stateId: 'KA', name: 'Hubli' },
    { id: '14', stateId: 'KA', name: 'Mangalore' },
    { id: '15', stateId: 'KA', name: 'Belgaum' }
  ];

  filteredCityList: City[] = [];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.debug('Initializing EmployeeGridListComponent...');
    this.getAllEmployees();
  }

  getAllEmployees(): void {
    console.debug('Fetching all employees...');
    this.employeeService.getAllEmployees().subscribe(
      (profiles) => {
        console.debug('Employee profiles received:', profiles);
        this.employees = profiles.map(emp => ({
          ...emp,
          employeeNetworkIps: emp.employeeNetworkIps ?? [],
          employeeNetworkIpList: emp.employeeNetworkIps ?? []
        }));
        console.debug('Processed employee data:', this.employees);
        
        // Fetch IPs for each employee
        this.employees.forEach(employee => this.loadEmployeeIps(employee));
      },
      (error) => {
        console.error('Error fetching employee profiles:', error);
        this.snackBar.open('Error fetching employee profiles. Please try again later.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }
  
  loadEmployeeIps(employee: Employee): void {
    console.debug(`Loading network IPs for employee with ID: ${employee.id}`);
    if (!employee || !employee.id) {
      console.error("Employee or employee.id is undefined.");
      return;
    }
    
    this.employeeService.getNetworkIpsByEmployeeId(employee.id).subscribe(
      (ips: EmployeeNetworkIp[]) => {
        console.debug(`Network IPs received for employee ${employee.id}:`, ips);
        employee.employeeNetworkIps = ips.length ? ips : [];
      },
      (error) => {
        console.error(`Error loading IPs for Employee ${employee.id}:`, error);
        if (error.status === 404) {
          console.warn(`No IP addresses found for Employee ${employee.id}`);
          employee.employeeNetworkIps = [];
        }
      }
    );
  }

  getStateNameById(id: string): string {
    console.debug(`Looking for state with ID: ${id}`);
    const state = this.stateList.find(s => s.id === id);
    if (!state) {
      console.warn(`State with ID: ${id} not found.`);
    }
    return state?.name ?? 'Unknown';
  }

  getCityNameById(id: string): string {
    console.debug(`Looking for city with ID: ${id}`);
    const city = this.cityList.find(c => c.id === id);
    if (!city) {
      console.warn(`City with ID: ${id} not found.`);
    }
    return city?.name ?? 'Unknown';
  }

  getIpAddresses(employeeNetworkIps: EmployeeNetworkIp[]): string {
    console.debug('Fetching IP addresses for employee...');
    return employeeNetworkIps && employeeNetworkIps.length
      ? employeeNetworkIps.map(ip => ip.ipAddress).join(', ')
      : 'No IPs';
  }

  deleteEmployee(employeeId: string): void {
    console.debug(`Deleting employee with ID: ${employeeId}`);
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response) => {
        console.debug('Employee deleted successfully:', response);
        this.snackBar.open('Employee deleted successfully!', 'Close', {
          duration: 3000
        });
        this.getAllEmployees(); // Refresh the list after deletion.
      },
      (error) => {
        console.error('Error deleting employee:', error);
        this.snackBar.open('Error deleting employee. Please try again later.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        if (error.error) {
          console.debug('Error response:', error.error);
        }
      }
    );
  }

  editEmployee(employee: Employee): void {
    console.debug(`Navigating to edit page for employee with ID: ${employee.id}`);
    this.router.navigate(['/edit-employees', employee.id]);
  }

  addEmployee(): void {
    console.debug('Navigating to add employee page...');
    this.router.navigate(['/add-employees']);
  }
}
