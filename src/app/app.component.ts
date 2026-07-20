import { Component } from '@angular/core';

import { LoginComponent } from './auth/login/login.component';
import { ReactiveFormLoginComponent } from './auth/reactive-form-login/reactive-form-login.component';
import { SignupComponent } from "./auth/signup/signup.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [LoginComponent, ReactiveFormLoginComponent, SignupComponent],
})
export class AppComponent {}
