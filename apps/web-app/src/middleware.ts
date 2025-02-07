import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

import { auth } from "@packages/auth";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "@packages/auth/routes";

import { i18n } from "./i18n";

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

function generateLocaleRoutes(locale: string, routes: string[]): string[] {
  return routes.map((route) => {
    if (route === "/") {
      return `/${locale}`;
    }
    return `/${locale}${route}`;
  });
}

export const config = {
  matcher: ["/((?!api|ingest|_next|.*\\..*).*)"],
};

export default auth((req) => {
  const { pathname, searchParams } = req.nextUrl;
  const searchString = searchParams.toString();
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const publicRoutesWithLocales = [
    ...i18n.locales.flatMap((locale) =>
      generateLocaleRoutes(locale, publicRoutes),
    ),
    ...publicRoutes,
  ];
  const authRoutesWithLocales = [
    ...i18n.locales.flatMap((locale) =>
      generateLocaleRoutes(locale, authRoutes),
    ),
    ...authRoutes,
  ];

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutesWithLocales.includes(nextUrl.pathname);
  const isAuthRoute = authRoutesWithLocales.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }

  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(req);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}${searchString.length ? `?${searchString}` : ""}`,
        req.url,
      ),
    );
  }
});
