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
export class AppComponent {
  // Synchronous validator
//(control) => null
// Async validator
//(control) => Observable<null | ValidationErrors>
// So, a custom validator is about how you implement the validation rule, while an async validator is about the timing/async nature of the validation.
//In fact, an async validator can also be a custom validator—the key difference is that it returns a Promise or Observable because it needs asynchronous work.
}
