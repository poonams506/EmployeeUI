import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from '../IemployeeModel';
import { EmployeeDetail } from '../IemployeeDetailModel';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-edit-department',
  templateUrl: './add-edit-department.component.html',
  styleUrls: ['./add-edit-department.component.css']
})
export class AddEditDepartmentComponent implements OnInit {
  employeeDetailForm!: FormGroup;
  employees: Employee[] = [];
  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  selectedDepartment: string = '';
  employee: any;
  employeeDetail: EmployeeDetail[] = [];
  employeeData: any;
  departments = [
    { id: 'IT', name: 'IT' },
    { id: 'HR', name: 'HR' },
    { id: 'Finance', name: 'Finance' }
  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<AddEditDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { member: Employee },
        private snackBar: MatSnackBar
      ) {}

      ngOnInit(): void {
        debugger;
        this.initializeForm();
        this.loadEmployees();
      
        if (this.data?.member) {
          this.isEditMode = true;
          this.employee = this.data.member; // Set employee here
          this.populateForm(this.employee); // Pass the employee to populate the form
        }
      }
      

  //   if (this.data?.member) {
  //     this.isEditMode = true;
  //     this.employee = this.data.member;
  //     console.log('Edit mode: employee data', this.employee);
  //     this.populateForm(this.employee);
  //   }
  // }

  initializeForm(): void {
    debugger;
    this.employeeDetailForm = this.fb.group({
      employeeId: ['', Validators.required],
      department: [this.selectedDepartment || '', Validators.required],
      name: ['', Validators.required],
    });
  }

  loadEmployees(): void {
    debugger;
    this.isLoading = true;
    this.employeeService.getAllEmployees().subscribe(data => {
      console.log('Loaded employee data:', data); // Log employee data
      this.employeeData = data.map(item => ({
        ...item,
        employeeId: item.id,
        name: item.name,
        department: item.department || ''  // Ensure department is mapped correctly
      }));
      this.employees = this.employeeData;
    });
  }

  populateForm(employee: EmployeeDetail): void {
    debugger;
    console.log('Populating form with employee data:', employee); // Log employee data before patching form
    this.employeeDetailForm.patchValue({
      employeeId: employee.employeeId || '',
      department: employee.department || '',
      name: employee.name || ''
    });
  }

  employeeId: any;
  selectEmployee(event: Event): void {
    debugger;
    const target = event.target as HTMLSelectElement;
    const selectedEmployeeId = target.value;
    const selectedEmployee = this.employees.find(emp => emp.id === selectedEmployeeId);
  
    console.log('Selected employee:', selectedEmployee); // Log selected employee data
    
    if (selectedEmployee) {
      this.employeeDetailForm.patchValue({
        employeeId: selectedEmployee.id, // Correct property
        name: selectedEmployee.name,
        department: selectedEmployee.department  // Ensure department is set
      });
    } else {
      console.error('Selected employee not found');
    }
  }

  selectDepartment(deptId: string): void {
    debugger;
    this.selectedDepartment = deptId;
    this.employeeDetailForm.patchValue({ department: deptId });
    console.log('Department selected:', deptId); // Log selected department
  }

  onSubmit(): void {
    debugger;
    if (this.employeeDetailForm.valid) {
      const formValues = this.employeeDetailForm.value;
      console.log('Form submitted with values:', formValues); // Log form values

      if (formValues.department && formValues.name && formValues.employeeId) {
        this.isLoading = true;

        if (this.isEditMode) {
          this.updateEmployeeDetail(formValues);
        } else {
          this.createEmployeeDetail(formValues);
        }
      }
    } else {
      console.error('Form is invalid'); // Log form invalid case
    }
  }

  updateEmployeeDetail(formValues: any): void {
    debugger;
    const employeeDetailToUpdate = { id: this.employee?.id, ...formValues };
  
    // Pass the id separately as the first argument
    this.employeeService.updateEmployeeDetail(employeeDetailToUpdate.id, employeeDetailToUpdate).subscribe(
      () => {
        alert('Employee updated successfully');
        this.dialogRef.close('updated');
        this.isLoading = false;
      },
      (error) => {
        console.error('Error updating employee:', error);
        alert('Error updating employee');
        this.isLoading = false;
      }
    );
  }
  

  createEmployeeDetail(formValues: any): void {
    debugger;
    this.employeeService.createEmployeeDetail(formValues).subscribe(
      () => {
        alert('Employee created successfully');
        this.dialogRef.close('added');
        this.isLoading = false;
      },
      (error) => {
        console.error('Error creating employee:', error);
        alert('Error creating employee');
        this.isLoading = false;
      }
    );
  }
}
