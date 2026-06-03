import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/store/auth.store';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormField],
  templateUrl: './register.html',
  styleUrl: './auth.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  protected authStore = inject(AuthStore);

  protected accountModel = signal({
    email: '',
    password: '',
  });

  protected registerForm = form(this.accountModel, (path) => {
    required(path.email, { message: 'Email is required.' });
    email(path.email, { message: 'Email is invalid.' });
    required(path.password, { message: 'Password is required.' });
    minLength(path.password, 8, { message: 'Password must be at least 8 characters' });
  });

  onRegister(event: Event): void {
    event.preventDefault();

    if (this.registerForm().valid()) {
      this.authStore.register(this.accountModel());
    }
  }
}
