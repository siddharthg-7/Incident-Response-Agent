/**
 * Basic routing and smoke test validation for Sentinel Memory frontend.
 */
export const REQUIRED_ROUTES = [
  '/dashboard',
  '/incidents',
  '/incidents/:id',
  '/memory',
  '/learning'
] as const;

export function validateRouteConfiguration(routes: readonly string[]): boolean {
  return routes.length === 5 && routes.includes('/dashboard');
}

// Self-executing validation check
console.assert(validateRouteConfiguration(REQUIRED_ROUTES), 'Core routes must be defined');
