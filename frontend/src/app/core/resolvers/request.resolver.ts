import { ResolveFn } from '@angular/router';

export const requestResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
