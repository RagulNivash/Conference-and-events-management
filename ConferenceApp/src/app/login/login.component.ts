import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  ConferenceAPIUrl: string;
  loginForm: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private auth: AuthService
  ) { 
    this.ConferenceAPIUrl = environment.ConferenceAPIUrl;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userid: [null, [Validators.required]]
    });
  }

  login(): void {
    if (!this.loginForm.valid) {
      return;
    }

    this.http.get(this.ConferenceAPIUrl + `users/${this.loginForm.value.userid}`)
    .subscribe((response: Array<any>) => {
      if(response.length > 0) {
        this.snackBar.open('Login successful', '',
        {
          duration: 2000,
          panelClass: ['my-snackbar'],
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.auth.login(response[0]._id, response[0].userid);
        this.router.navigate(['home']);
      }
      else {
        this.snackBar.open('Login failed', '',
        {
          duration: 3000,
          panelClass: ['my-snackbar'],
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
        
    }, error => {
      console.log(error);
      this.snackBar.open(error.error, '',
        {
          duration: 3000,
          panelClass: ['my-snackbar'],
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
    });
  }
}
