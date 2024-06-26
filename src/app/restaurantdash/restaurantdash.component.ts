import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResturentData } from './restuarant.model';
import { ApiService } from '../shared/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-restaurantdash',
  templateUrl: './restaurantdash.component.html',
  styleUrls: ['./restaurantdash.component.css']
})
export class RestaurantdashComponent implements OnInit {

  userFilter: string = '';
  totalLength: any;
  page: number = 1;
  pageSize: number = 10;
  formValue!: FormGroup
  restaurentModelObj: ResturentData = new ResturentData;
  allResturentData: any;

  //button disabes add & update
  showadd!: boolean;
  showbtn!: boolean;
  constructor(private formbuilder: FormBuilder, private api: ApiService, private toast: ToastrService) { }

  ngOnInit(): void {
    //alert("hello welcome to Our page")
    this.formValue = this.formbuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required],
      services: ['', Validators.required],
    })
    this.getAlldata()  // to render on screen data
  }

  clickaddresto() {
    this.formValue.reset();
    this.showadd = true;
    this.showbtn = false; //update
  }
  addRest() {
    this.restaurentModelObj.name = this.formValue.value.name;
    this.restaurentModelObj.email = this.formValue.value.email;
    this.restaurentModelObj.mobile = this.formValue.value.mobile;
    this.restaurentModelObj.address = this.formValue.value.address;
    this.restaurentModelObj.description = this.formValue.value.description;
    this.restaurentModelObj.services = this.formValue.value.services;
    this.api.postRestaurant(this.restaurentModelObj).subscribe(res => {
      this.toast.success(' Add Restaurant Sucessfully')
      this.formValue.reset()
      this.getAlldata();
    },
      err => {
        this.toast.error("something went wrong!!!");
      }
    )
  }

  getAlldata() {
    this.api.getAllRestaurant().subscribe(res => {
      this.allResturentData = res;
    })
  }
  //delete method to delete records
  deleteResto(data: any) {
    if (confirm('Are you sure to delete record?'))
      this.api.deleteRestaurant(data.id).subscribe(res => {
        this.toast.info('Record deleted sucessfully')
        this.getAlldata();
      })
  }
  // edit method
  oneditresto(data: any) {
    this.restaurentModelObj.id = data.id
    this.showadd = false; //add hide
    this.showbtn = true;//update

    this.formValue.controls['services'].setValue(data.services);
    this.formValue.controls['address'].setValue(data.address);
    this.formValue.controls['email'].setValue(data.email);
    this.formValue.controls['description'].setValue(data.description);
    this.formValue.controls['mobile'].setValue(data.mobile);
    this.formValue.controls['name'].setValue(data.name);

  }

  // update on edit

  updateRest() {
    this.restaurentModelObj.name = this.formValue.value.name;
    this.restaurentModelObj.email = this.formValue.value.email;
    this.restaurentModelObj.mobile = this.formValue.value.mobile;
    this.restaurentModelObj.address = this.formValue.value.address;
    this.restaurentModelObj.description = this.formValue.value.description;
    this.restaurentModelObj.services = this.formValue.value.services;

    this.api.updateRestaurant(this.restaurentModelObj, this.restaurentModelObj.id).subscribe(res => {
      this.toast.success('Updated sucessfully')
      this.formValue.reset()
      this.getAlldata();
    },
      err => {
        this.toast.error("something went wrong!!!");
      })
  }

  logout() {
    this.toast.success('Logged out sucessfully')
  }
}
