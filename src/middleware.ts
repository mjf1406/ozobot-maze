// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher(['/auth/sign-in(.*)', '/auth/sign-up(.*)', '/api/webhooks(.*)', '/']);

// export default clerkMiddleware((auth, request) => {
//   if(!isPublicRoute(request)) {
//     auth().protect();
//   }
// });

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// middleware.ts
import { createI18nMiddleware } from 'next-international/middleware'
import type { NextRequest } from 'next/server'
 
const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'ko', 'zh'],
  defaultLocale: 'en'
})
 
export function middleware(request: NextRequest) {
  return I18nMiddleware(request)
}
 
export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)']
}