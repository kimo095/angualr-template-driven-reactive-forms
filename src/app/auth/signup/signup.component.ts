import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators  , AbstractControl} from '@angular/forms';
import { debounceTime } from 'rxjs';

function equalValues(controlNameOne:string , controlNameTwo:string){
  return(control:AbstractControl)=>{
  const valOne = control.get(controlNameOne)?.value;
  const valTwo = control.get(controlNameTwo)?.value;
  if(valOne === valTwo){
      return null;
  }
  return {twoValuesAreNotEqual:true}
  };
}
// function mustContainAquestionMark(){
//   if(control.value.includes('?')){
//     return null;
//   }
//     return {doesNotContainQuestionMark: true}

// }
@Component({
  selector: 'app-signup',
  standalone: true,
  imports:[ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  private destroyRef = inject(DestroyRef); 
  form = new FormGroup({
    email : new FormControl(""),
    passwords :new FormGroup(
      {
      password : new FormControl(''),
      confirmPassword : new FormControl('' ,{validators:[]})
    },
    {
      validators:[Validators.minLength(6) , Validators.required ,equalValues('password' , 'confirmPassword')]
    }),
    names: new FormGroup({
      firstName : new FormControl("" , {validators:[Validators.required]}),
      lastName : new FormControl("" , {validators:[Validators.required]}),
    }),
    address : new FormGroup({
      street : new FormControl("" , {validators:[Validators.required]}),
      number: new FormControl("" , {validators:[Validators.required]}),
      postalCode : new FormControl("" , {validators:[Validators.required]}),
      city : new FormControl("" , {validators:[Validators.required]}),
    }),
    role : new FormControl<'student' | 'teacher' | 'employee' | 'founder' | 'other'>("student" , {validators:[Validators.required]}),
    agree : new FormControl(false , {validators:[Validators.required]}),
    source: new FormArray([
      new FormControl(false , {validators:[Validators.required]}),
      new FormControl(false , {validators:[Validators.required]}),
      new FormControl(false , {validators:[Validators.required]})
    ])
  })


  get emailInvalid(){
    return (
      this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid
    )
  }

  get passwordInvalid(){
    return (
      this.form.controls.passwords && this.form.controls.passwords.dirty && this.form.controls.passwords.invalid
    )
  }

  ngOnInit(){
      const savedForm = window.localStorage.getItem('saved-singup-form');
      if(savedForm){
      const savedFormData = JSON.parse(savedForm)
      this.form.patchValue({
        email:savedFormData.email
      })
      }
      const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
        next:(value)=>window.localStorage.setItem('saved-singup-form' ,
          JSON.stringify({email:value.email})
        )
      })
      this.destroyRef.onDestroy(()=>subscription.unsubscribe());
  }

  onSubmit(){
    if(this.form.invalid){
      console.log('invalid form');
      return;
      
      
    }
  }
  onReset(){
    this.form.reset()
  }
}
