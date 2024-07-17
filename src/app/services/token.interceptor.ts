import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginResult } from '@models/login-result';
import { LocalStorageService } from '@services/common/local-storage.service';
import { Utility } from 'app/shared/utility';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const loginResult = localStorageService.getLoginResult() as LoginResult;
  const nonAuthUrls = [`${Utility.serverUrl}/register`, `${Utility.serverUrl}/login`];

  if (!nonAuthUrls.includes(req.url)) {
    let reqWithToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${loginResult.token}`
      }
    });
    return next(reqWithToken);
  }
  return next(req);
};
