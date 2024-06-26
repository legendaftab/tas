import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    const authServiceStub = {
      isLoggedIn: jasmine.createSpy('isLoggedIn')
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceStub }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow the authenticated user to access app', () => {
    (authService.isLoggedIn as jasmine.Spy).and.returnValue(true);

    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    expect(guard.canActivate(route, state)).toBe(true);
  });

  it('should not allow the unauthenticated user to access app', () => {
    spyOn(window, 'alert');
    const navigateSpy = spyOn(router, 'navigate');

    (authService.isLoggedIn as jasmine.Spy).and.returnValue(false);

    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    expect(guard.canActivate(route, state)).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('you are not logged in please login');
    expect(navigateSpy).toHaveBeenCalledWith(['login']);
  });
});
