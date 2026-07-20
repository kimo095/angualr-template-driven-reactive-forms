import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';



//creating a custom validators:

function mustContainAquestionMark(control:AbstractControl){
  if(control.value.includes('?')){
    return null;
  }
    return {doesNotContainQuestionMark: true}

}

// creating async validator and it can be used to send http request to my server

function mustNotUseAdminEmail(control:AbstractControl){
  if(control.value !== 'admin@gmail.com'){
    return of(null);
  }
    return of({notUnique: true})

}

// using another way to save my data in the form , but it will not work in case of server side rendering 
      let intialEmailValue = '';
      const savedForm = window.localStorage.getItem('saved-login-form');
      if(savedForm){
        const loadFrom = JSON.parse(savedForm);
        intialEmailValue = loadFrom.email
      }

@Component({
  selector: 'app-reactive-form-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-form-login.component.html',
  styleUrl: './reactive-form-login.component.css'
})

export class ReactiveFormLoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  form = new FormGroup({
    email: new FormControl( intialEmailValue , {
      validators:[Validators.email , Validators.required],
      asyncValidators:mustNotUseAdminEmail
    }),
    password: new FormControl('' , {
      validators:[Validators.minLength(6) , Validators.required ,mustContainAquestionMark]
    })
  });

  ngOnInit(): void {
      // const savedForm = window.localStorage.getItem('saved-login-form');
      // if(savedForm){
      //   const loadFrom = JSON.parse(savedForm);
      //   // I use patchValue because with patch i can update partially my form element also i can add another method
      //   this.form.patchValue({
      //     email:loadFrom.email
      //   })
      // }
      const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
        next:(value)=>{
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({email:value.email})
          );
    },
  });
      this.destroyRef.onDestroy(()=> subscription.unsubscribe());
  }

  get emailInvalid(){
    return (
      this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid
    )
  }

  get passwordInvalid(){
    return (
      this.form.controls.password.touched && this.form.controls.password.dirty && this.form.controls.password.invalid
    )
  }

  onSubmit(){
      console.log(this.form);
      const enteredEmail = this.form.value.email;
      const enteredPassword = this.form.value.password;
      console.log(enteredEmail , enteredPassword); 
  }
  onReset(){
    this.form.reset()
  }

}
