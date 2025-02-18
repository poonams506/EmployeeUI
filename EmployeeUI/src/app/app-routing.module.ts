import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeModule } from './employee/employee.module';
import { EmployeeGridListComponent } from './employee/employee-grid-list/employee-grid-list.component';
import { AddEditEmployeeComponent } from './employee/add-edit-employee/add-edit-employee.component';
import { AddEditDepartmentComponent } from './employee/add-edit-department/add-edit-department.component';
import { DepartmentListComponent } from './employee/department-list/department-list.component';

const routes: Routes = [
  // { path: '', component: EmployeeGridListComponent },
  // { path: 'edit-employee/:id', component: AddEditEmployeeComponent },
  // { path: 'add-employee', component: AddEditEmployeeComponent },
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeeGridListComponent },
  { path: 'edit-employees/:id', component: AddEditEmployeeComponent },
  { path: 'add-employees', component: AddEditEmployeeComponent }, // Optional: for adding employees
  { path: 'department-list', component: DepartmentListComponent },
  { path: 'add-department-list', component: AddEditDepartmentComponent },
  { path: 'edit-department-list/:id', component: AddEditDepartmentComponent },
  { path: 'members', redirectTo: '/members', pathMatch: 'full' }  // Corrected redirection
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
