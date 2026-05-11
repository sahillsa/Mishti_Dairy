import { Component, inject } from '@angular/core';

import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: false,
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
})
export class BottomNavComponent {
  private readonly authService = inject(AuthService);
  readonly user$ = this.authService.currentUser$;
}
