import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee, EmployeeNetworkIp } from '../IemployeeModel';
import { City } from '../ICity';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.css']
})
export class AddEditEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  employeeId: string | null = null;
  isEditMode: boolean = false;
  stateList = [
    { id: 'DL', name: 'Delhi' },
    { id: 'MH', name: 'Maharashtra' },
    { id: 'KA', name: 'Karnataka' }
  ];

  cityList: City[] = [
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
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.route.paramMap.subscribe((params) => {
      const employeeId = params.get('id');
      if (employeeId) {
        this.isEditMode = true;
        this.employeeId = employeeId;
        this.loadEmployeeData(employeeId);
      } else {
        this.isEditMode = false;
        this.addIp();
      }
    });
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      id: [null],
      employCode: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dob: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      employeeNetworkIps: this.fb.array([])
    });
  }

  loadEmployeeData(employeeId: string): void {
    this.employeeService.getEmployeeById(employeeId).subscribe(
      (employee) => {
        if (employee) {
          this.employeeForm.patchValue({
            id: employee.id ?? null,
            employCode: employee.employCode ?? '',
            name: employee.name ?? '',
            email: employee.email ?? '',
            mobile: employee.mobile ?? '',
            dob: employee.dob ? this.formatDate(employee.dob) : '', // Format date
            state: employee.state ?? '',
            city: employee.city ?? ''
          });

          this.filterCities(employee.state ?? '');

          const ipFormArray = this.employeeForm.get('employeeNetworkIps') as FormArray;
          ipFormArray.clear(); 

          if (employee.employeeNetworkIps && employee.employeeNetworkIps.length) {
            employee.employeeNetworkIps.forEach(ip => {
              ipFormArray.push(this.fb.group({ ipAddress: [ip.ipAddress, Validators.required] }));
            });
          } else {
            this.addIp(); 
          }
        }
      },
      () => {
        this.snackBar.open('Error fetching employee data.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    );
  }

  onStateChange(): void {
    const selectedState = this.employeeForm.get('state')?.value;
    this.filterCities(selectedState);
    this.employeeForm.get('city')?.patchValue('');
  }

  filterCities(stateId: string): void {
    this.filteredCityList = this.cityList.filter(city => city.stateId === stateId);
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const employeeData: Employee = this.employeeForm.getRawValue();
    employeeData.employeeNetworkIps = employeeData.employeeNetworkIps.filter(ip => ip.ipAddress && ip.ipAddress.trim() !== '');

    if (this.isEditMode) {
      this.employeeService.updateEmployee(employeeData.id, employeeData).subscribe(
        () => {
          this.snackBar.open('Employee updated successfully.', 'Close', { duration: 3000 });
          this.router.navigate(['/employee']);
        },
        () => {
          this.snackBar.open('Error updating employee.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      );
    } else {
      this.employeeService.createEmployee(employeeData).subscribe(
        () => {
          this.snackBar.open('Employee added successfully.', 'Close', { duration: 3000 });
          this.router.navigate(['/employees']);
        },
        () => {
          this.snackBar.open('Error adding employee.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      );
    }
  }

  get employeeNetworkIps(): FormArray {
    return this.employeeForm.get('employeeNetworkIps') as FormArray;
  }

  addIp(ipAddress: string = ''): void {
    this.employeeNetworkIps.push(this.fb.group({ ipAddress: [ipAddress, Validators.required] }));
  }

  removeIp(index: number): void {
    this.employeeNetworkIps.removeAt(index);
  }

  onReset(): void {
    this.employeeNetworkIps.clear();
    this.addIp();
    this.employeeForm.reset();
    this.isEditMode ? this.disableFields() : this.enableAllFields();
  }

  disableFields(): void {
    ['employCode', 'email', 'mobile'].forEach(field => this.employeeForm.get(field)?.disable());
  }

  enableAllFields(): void {
    ['employCode', 'email', 'mobile'].forEach(field => this.employeeForm.get(field)?.enable());
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2); // Ensure 2 digits
    const day = ('0' + d.getDate()).slice(-2); // Ensure 2 digits
    return `${year}-${month}-${day}`;
  }
}
