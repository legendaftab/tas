import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RestaurantdashComponent } from './restaurantdash.component';
import { ApiService } from '../shared/api.service';
import { of, throwError } from 'rxjs';
import { ResturentData } from './restuarant.model';

describe('RestaurantdashComponent', () => {
  let component: RestaurantdashComponent;
  let fixture: ComponentFixture<RestaurantdashComponent>;
  let httpMock: HttpTestingController;
  let apiService: ApiService;
  let toastrService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestaurantdashComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        ToastrModule.forRoot()
      ],
      providers: [ApiService, ToastrService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantdashComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
    toastrService = TestBed.inject(ToastrService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form invalid when empty', () => {
    expect(component.formValue.valid).toBeFalsy();
  });

  it('should validate form fields', () => {
    let name = component.formValue.controls['name'];
    let email = component.formValue.controls['email'];
    let mobile = component.formValue.controls['mobile'];
    let address = component.formValue.controls['address'];
    let description = component.formValue.controls['description'];
    let services = component.formValue.controls['services'];

    name.setValue('');
    email.setValue('');
    mobile.setValue('');
    address.setValue('');
    description.setValue('');
    services.setValue('');

    expect(name.valid).toBeFalsy();
    expect(email.valid).toBeFalsy();
    expect(mobile.valid).toBeFalsy();
    expect(address.valid).toBeFalsy();
    expect(description.valid).toBeFalsy();
    expect(services.valid).toBeFalsy();
  });

  it('should call addRest and display success toast on successful addition', () => {
    spyOn(toastrService, 'success');
    spyOn(apiService, 'postRestaurant').and.returnValue(of({}));

    component.formValue.controls['name'].setValue('Test Restaurant');
    component.formValue.controls['email'].setValue('test@example.com');
    component.formValue.controls['mobile'].setValue('1234567890');
    component.formValue.controls['address'].setValue('123 Test Street');
    component.formValue.controls['description'].setValue('Test Description');
    component.formValue.controls['services'].setValue('Test Services');

    component.addRest();

    expect(apiService.postRestaurant).toHaveBeenCalled();
    expect(toastrService.success).toHaveBeenCalledWith('Add Restaurant Sucessfully');
    expect(component.formValue.reset).toHaveBeenCalled();
  });

  it('should call addRest and display error toast on failed addition', () => {
    spyOn(toastrService, 'error');
    spyOn(apiService, 'postRestaurant').and.returnValue(throwError({}));

    component.formValue.controls['name'].setValue('Test Restaurant');
    component.formValue.controls['email'].setValue('test@example.com');
    component.formValue.controls['mobile'].setValue('1234567890');
    component.formValue.controls['address'].setValue('123 Test Street');
    component.formValue.controls['description'].setValue('Test Description');
    component.formValue.controls['services'].setValue('Test Services');

    component.addRest();

    expect(apiService.postRestaurant).toHaveBeenCalled();
    expect(toastrService.error).toHaveBeenCalledWith('something went wrong!!!');
  });

  it('should call updateRest and display success toast on successful update', () => {
    spyOn(toastrService, 'success');
    spyOn(apiService, 'updateRestaurant').and.returnValue(of({}));

    component.formValue.controls['name'].setValue('Test Restaurant');
    component.formValue.controls['email'].setValue('test@example.com');
    component.formValue.controls['mobile'].setValue('1234567890');
    component.formValue.controls['address'].setValue('123 Test Street');
    component.formValue.controls['description'].setValue('Test Description');
    component.formValue.controls['services'].setValue('Test Services');

    component.updateRest();

    expect(apiService.updateRestaurant).toHaveBeenCalled();
    expect(toastrService.success).toHaveBeenCalledWith('Updated sucessfully');
    expect(component.formValue.reset).toHaveBeenCalled();
  });

  it('should call updateRest and display error toast on failed update', () => {
    spyOn(toastrService, 'error');
    spyOn(apiService, 'updateRestaurant').and.returnValue(throwError({}));

    component.formValue.controls['name'].setValue('Test Restaurant');
    component.formValue.controls['email'].setValue('test@example.com');
    component.formValue.controls['mobile'].setValue('1234567890');
    component.formValue.controls['address'].setValue('123 Test Street');
    component.formValue.controls['description'].setValue('Test Description');
    component.formValue.controls['services'].setValue('Test Services');

    component.updateRest();

    expect(apiService.updateRestaurant).toHaveBeenCalled();
    expect(toastrService.error).toHaveBeenCalledWith('something went wrong!!!');
  });

  it('should call deleteResto and display success toast on successful deletion', () => {
    spyOn(toastrService, 'info');
    spyOn(apiService, 'deleteRestaurant').and.returnValue(of({}));
    spyOn(window, 'confirm').and.returnValue(true);

    const mockData = { id: 1 };
    component.deleteResto(mockData);

    expect(apiService.deleteRestaurant).toHaveBeenCalledWith(mockData.id);
    expect(toastrService.info).toHaveBeenCalledWith('Record deleted sucessfully');
  });

  it('should call deleteResto and not proceed when user cancels', () => {
    spyOn(apiService, 'deleteRestaurant');
    spyOn(window, 'confirm').and.returnValue(false);

    const mockData = { id: 1 };
    component.deleteResto(mockData);

    expect(apiService.deleteRestaurant).not.toHaveBeenCalled();
  });

  it('should initialize form and get all restaurant data on init', () => {
    spyOn(component, 'getAlldata');
    component.ngOnInit();
    expect(component.getAlldata).toHaveBeenCalled();
  });
});
