import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formValues!: FormGroup;
  hide: any;

  constructor(
    private formbuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.formValues = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // login method
  login() {
    this.http.get<any>("http://localhost:3000/signup").subscribe(
      res => {
        //matching email and password
        const user = res.find((a: any) => {
          return a.email === this.formValues.value.email && a.password === this.formValues.value.password;
        });
        // condition check for login
        if (user) {
          this.toast.success('Successfully logged in');
          this.formValues.reset();
          this.router.navigate(['restaurent']);
          localStorage.setItem('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
          if (this.formValues.value.emailid) {
            localStorage.setItem('usertype', 'employee');
          }
        } else {
          this.toast.error('User not found with these credentials');
        }
      },
      err => {
        this.toast.warning('Something went wrong');
      }
    );
  }
}
