import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router, UrlTree } from '@angular/router';
import { LocalStorageService } from '@services/common/local-storage.service';
import { Observable, filter, map, of, switchMap, take } from 'rxjs';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const router: Router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  if (localStorageService.getLoginResult()) {
    return of(true);
  }
  router.navigate(['/login']);
  return of(false);
};
