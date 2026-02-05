import { NextRequest, NextResponse } from "next/server";

// Rutas que no requieren autenticación
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/",
];

// Rutas que requieren autenticación
const protectedRoutes = [
  "/profile",
  "/gestor-apis",
  "/gestor-proveedores",
  "/actions",
  "/my-api",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si la ruta es pública
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  // Verificar si la ruta es protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si es una ruta pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Si es una ruta protegida, verificar autenticación
  if (isProtectedRoute) {
    // Obtener las cookies de sesión
    const sessionCookie = request.cookies.get("__Secure-auth.session-token") ||
      request.cookies.get("auth.session-token");

    // Si no hay sesión, redirigir a login
    if (!sessionCookie) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
