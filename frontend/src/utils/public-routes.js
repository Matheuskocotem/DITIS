const publicRoutes = ['/login', '/register']

export function isPublicRoute(url) {
  return publicRoutes.includes(url || '')
}