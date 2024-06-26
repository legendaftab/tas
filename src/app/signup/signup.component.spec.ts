import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SignupComponent } from './signup.component';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpMock: HttpTestingController;
  let toastrService: ToastrService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupComponent ],
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
    fixture = TestBed.createComponent(SignupComponent);
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
    expect(component.myform.valid).toBeFalsy();
  });

  it('should validate form fields', () => {
    let name = component.myform.controls['name'];
    let email = component.myform.controls['email'];
    let mobile = component.myform.controls['mobile'];
    let password = component.myform.controls['password'];

    name.setValue('');
    email.setValue('');
    mobile.setValue('');
    password.setValue('');

    expect(name.valid).toBeFalsy();
    expect(email.valid).toBeFalsy();
    expect(mobile.valid).toBeFalsy();
    expect(password.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    let email = component.myform.controls['email'];
    email.setValue('test');
    expect(email.valid).toBeFalsy();
    email.setValue('test@test.com');
    expect(email.valid).toBeTruthy();
  });

  it('should make a post request and navigate to login on successful signup', () => {
    spyOn(toastrService, 'success');
    spyOn(router, 'navigate');

    component.myform.controls['name'].setValue('John Doe');
    component.myform.controls['email'].setValue('test@test.com');
    component.myform.controls['mobile'].setValue('1234567890');
    component.myform.controls['password'].setValue('password');
    
    component.signup();

    const req = httpMock.expectOne('http://localhost:3000/signup');
    expect(req.request.method).toBe('POST');
    req.flush({});

    expect(toastrService.success).toHaveBeenCalledWith('Registred successfully');
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should display an error message on failed signup', () => {
    spyOn(toastrService, 'error');

    component.myform.controls['name'].setValue('John Doe');
    component.myform.controls['email'].setValue('test@test.com');
    component.myform.controls['mobile'].setValue('1234567890');
    component.myform.controls['password'].setValue('password');
    
    component.signup();

    const req = httpMock.expectOne('http://localhost:3000/signup');
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 500, statusText: 'Server Error' });

    expect(toastrService.error).toHaveBeenCalledWith('something went wrong');
  });
});
