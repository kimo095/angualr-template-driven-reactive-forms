import { afterNextRender, Component , DestroyRef, inject, viewChild} from '@angular/core';
import { FormsModule, NgForm} from '@angular/forms';
import { debounce, debounceTime } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports:[FormsModule],
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private form = viewChild.required<NgForm>('form');
  private DestroyRef = inject(DestroyRef);

  constructor(){
    const savedFormData = window.localStorage.getItem('saved-logging-form');
    
    if(savedFormData){
      const FormsData = JSON.parse(savedFormData);
      const savedEmail = FormsData.email;
      setTimeout(()=>{
        this.form().setValue({
          email:savedEmail,
          password:''
        })
      },1)
   
    }
    afterNextRender(()=>{
      const subscription = this.form().valueChanges?.pipe(debounceTime(500)).subscribe({
        next:(value)=>window.localStorage.setItem('saved-logging-form' , JSON.stringify({email:value.email}))
      })
      this.DestroyRef.onDestroy(()=>subscription?.unsubscribe())
    })
  }

  onSubmit(formData:NgForm){
    if(formData.form.invalid){
      return;
    }
    const enteredEmail = formData.form.value.email;
    const enteredPassword = formData.form.value.password;
    console.log( enteredEmail ,enteredPassword);

    formData.form.reset()
    
  }
}
