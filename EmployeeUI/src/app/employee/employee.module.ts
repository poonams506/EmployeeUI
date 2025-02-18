import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeGridListComponent } from './employee-grid-list/employee-grid-list.component';
import { AddEditEmployeeComponent } from './add-edit-employee/add-edit-employee.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentListComponent } from './department-list/department-list.component';
import { AddEditDepartmentComponent } from './add-edit-department/add-edit-department.component';



@NgModule({
  declarations: [
    EmployeeGridListComponent,
    AddEditEmployeeComponent,
    DepartmentListComponent,
    AddEditDepartmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    
  ]
})
export class EmployeeModule { }
