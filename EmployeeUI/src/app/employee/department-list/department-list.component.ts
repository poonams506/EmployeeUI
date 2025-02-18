import { Component } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditDepartmentComponent } from '../add-edit-department/add-edit-department.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDetail } from '../IemployeeDetailModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent {
 employees: EmployeeDetail[] = [];
 
   constructor(
     private employeeService: EmployeeService,
     private router: Router,
     private dialog: MatDialog  // Inject MatDialog here
   ) { }
 
   ngOnInit(): void {
     this.getAllEmployeesDetails();
   }
 
  
 
   getAllEmployeesDetails(): void {
    debugger;
     this.employeeService.getAllEmployeeDetails().subscribe(
       (profiles) => {
         this.employees = profiles.filter(emp => !emp.isDeleted); // Only show non-deleted employees
       },
       (error) => {
         console.error('Error fetching employees:', error);
       }
     );
   }
   
   // Open the dialog for adding a new employee
   addEmployeeDetail(): void {
     const dialogRef = this.dialog.open(AddEditDepartmentComponent, {
       data: { member: null }  // No member data means it's for adding
     });
 
     dialogRef.afterClosed().subscribe(result => {
       if (result === 'added') {
         this.getAllEmployeesDetails();  // Refresh list if a new member was added
       }
     });
   }

   editEmployeeDetail(id: string): void {
       debugger;
       this.employeeService.getEmployeeDetailById(id).subscribe(
         (memberData) => {
           if (memberData) {
             const dialogRef = this.dialog.open(AddEditDepartmentComponent, {
               data: { member: memberData }
             });
     
             dialogRef.afterClosed().subscribe(result => {
               console.log('Dialog closed with result:', result); // Debug log
               if (result === 'updated') {
                 this.getAllEmployeesDetails(); // Refresh list after update
               }
             });
           }
         },
         (error) => {
           console.error('Error fetching member data:', error);
           alert('Failed to fetch member details. Please try again.');
         }
       );
     }

   
  deleteEmployeeDetail(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      // Store a copy of the current employee list in case we need to revert
      const previousEmployees = [...this.employees];
  
      // Optimistic UI update: set 'isDeleted' flag to true for the employee
      this.employees = this.employees.map(emp =>
        emp.id === id ? { ...emp, isDeleted: true } : emp
      );
  
      // Call API to delete employee
      this.employeeService.deleteEmployeeDetail(id).subscribe(
        () => {
          alert('Employee deleted successfully!');
          // Refresh the employee list after successful deletion
          this.getAllEmployeesDetails();
        },
        (error) => {
          console.error('Error deleting employee:', error);
          alert('Failed to delete employee. Please try again.');
  
          // Revert the optimistic UI update on failure
          this.employees = previousEmployees;
        }
      );
    }
  }
   
 
 }
 