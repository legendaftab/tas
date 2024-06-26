import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let toastrService: ToastrService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([]),
        ToastrModule.forRoot()
      ],
      providers: [ ToastrService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    toastrService = TestBed.inject(ToastrService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form invalid when empty', () => {
    expect(component.formValues.valid).toBeFalsy();
  });

  it('should validate form fields', () => {
    let email = component.formValues.controls['email'];
    let password = component.formValues.controls['password'];

    email.setValue('');
    password.setValue('');

    expect(email.valid).toBeFalsy();
    expect(password.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    let email = component.formValues.controls['email'];
    email.setValue('test');
    expect(email.valid).toBeFalsy();
    email.setValue('test@test.com');
    expect(email.valid).toBeTruthy();
  });

  it('should make a GET request and navigate to restaurant on successful login', () => {
    spyOn(toastrService, 'success');
    spyOn(router, 'navigate');

    component.formValues.controls['email'].setValue('test@test.com');
    component.formValues.controls['password'].setValue('password');

    component.login();

    const req = httpMock.expectOne('http://localhost:3000/signup');
    expect(req.request.method).toBe('GET');
    req.flush([{ email: 'test@test.com', password: 'password' }]);

    expect(toastrService.success).toHaveBeenCalledWith('Successfully logged in');
    expect(router.navigate).toHaveBeenCalledWith(['resturent']);
  });

  it('should display an error message when user is not found', () => {
    spyOn(toastrService, 'error');

    component.formValues.controls['email'].setValue('wrong@test.com');
    component.formValues.controls['password'].setValue('password');

    component.login();

    const req = httpMock.expectOne('http://localhost:3000/signup');
    expect(req.request.method).toBe('GET');
    req.flush([{ email: 'test@test.com', password: 'password' }]);

    expect(toastrService.error).toHaveBeenCalledWith('User not found with these credentials');
  });

  it('should display a warning message on server error', () => {
    spyOn(toastrService, 'warning');

    component.formValues.controls['email'].setValue('test@test.com');
    component.formValues.controls['password'].setValue('password');

    component.login();

    const req = httpMock.expectOne('http://localhost:3000/signup');
    expect(req.request.method).toBe('GET');
    req.flush({}, { status: 500, statusText: 'Server Error' });

    expect(toastrService.warning).toHaveBeenCalledWith('Something went wrong');
  });
});
