import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Employee, EmployeeNetworkIp } from './IemployeeModel';
import { EmployeeDetail } from './IemployeeDetailModel';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'https://localhost:7089/api/employee'; // Employee API endpoint
  private apiUrlDetail = 'https://localhost:7089/api/employeeDetail'; // Employee Detail API endpoint
  private networkIpsApiUrl = 'https://localhost:7089/api/EmployeeNetworkIp'; // Employee Network IPs API endpoint
  
  constructor(private http: HttpClient) {}

  // Helper function to handle HTTP errors globally
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  // Get all employees
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      catchError(this.handleError('getAllEmployees', []))
    );
  }

  // Get employee by ID
  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<Employee>('getEmployeeById'))
    );
  }

  // Create a new employee
  createEmployee(createEmployeeDto: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/create`, createEmployeeDto).pipe(
      catchError(this.handleError<Employee>('createEmployee'))
    );
  }

  // Update an existing employee
  updateEmployee(id: string, employeeDto: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employeeDto).pipe(
      catchError(this.handleError<Employee>('updateEmployee'))
    );
  }

  // Delete an employee by ID
  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<void>('deleteEmployee'))
    );
  }

  // Get all employee details
  getAllEmployeeDetails(): Observable<EmployeeDetail[]> {
    return this.http.get<EmployeeDetail[]>(this.apiUrlDetail).pipe(
      catchError(this.handleError('getAllEmployeeDetails', []))
    );
  }

  // Get employee details by ID
  getEmployeeDetailById(id: string): Observable<EmployeeDetail> {
    return this.http.get<EmployeeDetail>(`${this.apiUrlDetail}/${id}`).pipe(
      catchError(this.handleError<EmployeeDetail>('getEmployeeDetailById'))
    );
  }

  // Create a new employee detail (e.g., department info)
  createEmployeeDetail(employeeDetail: EmployeeDetail): Observable<EmployeeDetail> {
    return this.http.post<EmployeeDetail>(this.apiUrlDetail, employeeDetail).pipe(
      catchError(this.handleError<EmployeeDetail>('createEmployeeDetail'))
    );
  }

  // Update existing employee detail
  updateEmployeeDetail(id: string, employeeDetail: EmployeeDetail): Observable<EmployeeDetail> {
    return this.http.put<EmployeeDetail>(`${this.apiUrlDetail}/${id}`, employeeDetail).pipe(
      catchError(this.handleError<EmployeeDetail>('updateEmployeeDetail'))
    );
  }

  // Delete employee detail by ID
  deleteEmployeeDetail(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlDetail}/${id}`).pipe(
      catchError(this.handleError<void>('deleteEmployeeDetail'))
    );
  }

  // Get all network IPs for an employee
  getNetworkIpsByEmployeeId(employeeId: string): Observable<EmployeeNetworkIp[]> {
    return this.http.get<EmployeeNetworkIp[]>(`${this.networkIpsApiUrl}/byEmployee/${employeeId}`).pipe(
      catchError(this.handleError('getNetworkIpsByEmployeeId', []))
    );
  }

  // Get a single network IP by ID
  getNetworkIpById(id: string): Observable<EmployeeNetworkIp> {
    return this.http.get<EmployeeNetworkIp>(`${this.networkIpsApiUrl}/${id}`).pipe(
      catchError(this.handleError<EmployeeNetworkIp>('getNetworkIpById'))
    );
  }

  // Create a new network IP
  createNetworkIp(networkIp: EmployeeNetworkIp): Observable<EmployeeNetworkIp> {
    return this.http.post<EmployeeNetworkIp>(this.networkIpsApiUrl, networkIp).pipe(
      catchError(this.handleError<EmployeeNetworkIp>('createNetworkIp'))
    );
  }

  // Update an existing network IP
  updateNetworkIp(id: string, networkIp: EmployeeNetworkIp): Observable<EmployeeNetworkIp> {
    return this.http.put<EmployeeNetworkIp>(`${this.networkIpsApiUrl}/${id}`, networkIp).pipe(
      catchError(this.handleError<EmployeeNetworkIp>('updateNetworkIp'))
    );
  }

  // Delete a network IP
  deleteNetworkIp(id: string): Observable<void> {
    return this.http.delete<void>(`${this.networkIpsApiUrl}/${id}`).pipe(
      catchError(this.handleError<void>('deleteNetworkIp'))
    );
  }
}
