export function isAuthPath(pathname = "") {
  return (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")
  );
}

export function isPublicPath(pathname = "") {
  if (!pathname || pathname === "/") return true;
  return (
    isAuthPath(pathname) ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/solutions") ||
    pathname.startsWith("/product") ||
    pathname.startsWith("/case-studies") ||
    pathname.startsWith("/integrations") ||
    pathname.startsWith("/help") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/security") ||
    pathname.startsWith("/refund-policy") ||
    pathname.startsWith("/shipping-policy") ||
    pathname.startsWith("/cookie-policy") ||
    pathname.startsWith("/data-deletion") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/c") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/view") ||
    pathname.startsWith("/invite")
  );
}

export function getDomainInfo(input) {
  const host = (
    typeof input === "string"
      ? (input.includes("://") ? new URL(input).host : input)
      : input?.headers?.get?.("host") ||
        input?.nextUrl?.host ||
        (typeof window !== "undefined" ? window.location.host : "")
  ).toLowerCase();

  const [hostname, port] = host.split(":");
  const portSuffix = port ? `:${port}` : "";

  if (hostname === "localhost" || hostname === "127.0.0.1" || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    return { isSubdomain: false, subdomain: null, apexHost: host, mainDomain: hostname };
  }

  if (hostname.endsWith(".localhost")) {
    const subdomain = hostname.slice(0, -10);
    return {
      isSubdomain: Boolean(subdomain),
      subdomain: subdomain || null,
      apexHost: `localhost${portSuffix}`,
      mainDomain: "localhost",
    };
  }

  const parts = hostname.split(".");
  if (parts.length > 2) {
    const subdomain = parts.slice(0, -2).join(".");
    const apexHostname = parts.slice(-2).join(".");
    return {
      isSubdomain: true,
      subdomain,
      apexHost: `${apexHostname}${portSuffix}`,
      mainDomain: apexHostname,
    };
  }

  return { isSubdomain: false, subdomain: null, apexHost: host, mainDomain: hostname };
}

export function getMainDomainUrl(path = "/", currentUrlOrHost) {
  const protocol = typeof window !== "undefined" ? window.location.protocol : "http:";
  const { apexHost } = getDomainInfo(currentUrlOrHost);
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `${protocol}//${apexHost}${cleanPath}`;
}

export function getMainDomain(currentUrlOrHost) {
  return getDomainInfo(currentUrlOrHost).mainDomain;
}

export function getCurrentSubdomain(currentUrlOrHost) {
  return getDomainInfo(currentUrlOrHost).subdomain;
}

export function isLocalhost() {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

export function redirectToMainDomain(path = "/") {
  if (typeof window !== "undefined") window.location.href = getMainDomainUrl(path);
}

export function updateSubdomain(url, subdomain = null) {
  const base = typeof window !== "undefined" ? window.location.origin : "http://dragbizz.local";
  const u = new URL(url, base);
  const { apexHost } = getDomainInfo(u.host);
  u.host = subdomain ? `${subdomain}.${apexHost}` : apexHost;
  return { url: u.toString(), hasSubdomain: Boolean(subdomain) };
}

export function redirectToSubdomain(subdomain, path = "/") {
  if (typeof window !== "undefined") {
    window.location.replace(updateSubdomain(getMainDomainUrl(path), subdomain).url);
  }
}

export function getDashboardUrl(tenant, path = "/dashboard") {
  return updateSubdomain(getMainDomainUrl(path), tenant).url;
}

export function ensureSubdomain(tenant, path = (typeof window !== "undefined" ? window.location.pathname : "/")) {
  if (typeof window === "undefined") return;
  const currentSub = getCurrentSubdomain();
  if (isLocalhost()) {
    if (currentSub) redirectToMainDomain(path);
    return;
  }
  if (currentSub !== tenant) redirectToSubdomain(tenant, path);
}

export function ensureMainDomain(path = (typeof window !== "undefined" ? window.location.pathname : "/")) {
  if (typeof window !== "undefined" && getCurrentSubdomain()) redirectToMainDomain(path);
}

export function checkSubdomainPublicRedirect(request) {
  const host = (request.headers.get("host") || request.nextUrl?.host || "").toLowerCase();

  if (host.startsWith("www.")) {
    const targetUrl = request.nextUrl.clone();
    targetUrl.host = host.slice(4);
    return { shouldRedirect: true, targetUrl: targetUrl.toString(), statusCode: 301 };
  }

  const domainInfo = getDomainInfo(host);
  if (!domainInfo.isSubdomain) return { shouldRedirect: false, domainInfo };

  const { pathname, search } = request.nextUrl;
  if (!isPublicPath(pathname)) return { shouldRedirect: false, domainInfo };

  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "") || "http";
  const targetUrl = `${proto}://${domainInfo.apexHost}${pathname}${search || ""}`;

  return {
    shouldRedirect: true,
    targetUrl,
    statusCode: isAuthPath(pathname) ? 307 : 301,
    domainInfo,
  };
}
