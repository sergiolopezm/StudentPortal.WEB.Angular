import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const expectedRoles = route.data?.['roles'] as string[];
    
    if (expectedRoles) {
      const currentUser = authService.getCurrentUser();
      if (currentUser && expectedRoles.includes(currentUser.rol)) {
        return true;
      } else {
        router.navigate(['/dashboard']);
        return false;
      }
    }
    
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};