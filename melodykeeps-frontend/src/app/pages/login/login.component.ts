import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit(event: Event) {
    event.preventDefault();
    this.error.set(null);
    this.loading.set(true);
    try {
      await this.auth.login(this.email(), this.password());
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.error.set(error?.message || 'Correo o contraseña incorrectos.');
    } finally {
      this.loading.set(false);
    }
  }
}
