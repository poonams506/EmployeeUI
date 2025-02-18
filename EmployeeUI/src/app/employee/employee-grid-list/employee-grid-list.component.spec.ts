import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeGridListComponent } from './employee-grid-list.component';

describe('EmployeeGridListComponent', () => {
  let component: EmployeeGridListComponent;
  let fixture: ComponentFixture<EmployeeGridListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeGridListComponent]
    });
    fixture = TestBed.createComponent(EmployeeGridListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
