import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if token is present in localStorage', () => {
    localStorage.setItem('token', 'fake-token');
    expect(service.isLoggedIn()).toBe(true);
    localStorage.removeItem('token');
  });

  it('should return false if token is not present in localStorage', () => {
    localStorage.removeItem('token');
    expect(service.isLoggedIn()).toBe(false);
  });
});
