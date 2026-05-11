import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('logs in the demo user', () => {
    expect(service.login('user@mishti.in', 'user123')).toBe(true);
    expect(service.currentUser?.role).toBe('user');
  });

  it('logs in the demo admin', () => {
    expect(service.login('admin@mishti.in', 'admin123')).toBe(true);
    expect(service.isAdmin()).toBe(true);
  });
});
