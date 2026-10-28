export const DEFAULT_PLATFORM_DOMAINS = [
  "dragbizz.local",
  "dragbizz.io",
  "dragbizz.com",
  "localhost",
  "127.0.0.1",
];

export const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "admin",
  "app",
  "dashboard",
  "mail",
  "smtp",
  "pop",
  "imap",
  "ftp",
  "staging",
  "dev",
  "test",
  "demo",
  "status",
  "support",
  "help",
  "auth",
  "login",
  "register",
  "signup",
  "billing",
  "store",
  "catalog",
  "portal",
  "internal",
  "root",
  "ns",
  "dns",
  "cdn",
  "static",
  "assets",
  "public",
  "docs",
  "account",
  "accounts",
  "checkout",
  "payment",
  "payments",
]);

export function getPlatformDomains() {
  const envVal =
    typeof process !== "undefined"
      ? process.env?.NEXT_PUBLIC_PLATFORM_DOMAINS ||
        process.env?.PLATFORM_DOMAINS
      : null;

  if (!envVal || typeof envVal !== "string") {
    return DEFAULT_PLATFORM_DOMAINS;
  }

  const parsed = envVal
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : DEFAULT_PLATFORM_DOMAINS;
}

export function isReservedSubdomain(subdomain = "") {
  if (!subdomain) return false;
  return RESERVED_SUBDOMAINS.has(String(subdomain).toLowerCase().trim());
}

export function getDomainInfo(input) {
  const host = (
    typeof input === "string"
      ? (input.includes("://") ? new URL(input).host : input)
      : input?.headers?.get?.("host") ||
        input?.nextUrl?.host ||
        (typeof window !== "undefined" ? window.location.host : "")
  )
    .toLowerCase()
    .trim();

  const [hostname, port] = host ? host.split(":") : ["", ""];
  const portSuffix = port ? `:${port}` : "";
  const platformDomains = getPlatformDomains();

  if (!hostname) {
    const defaultHost = platformDomains[0] || DEFAULT_PLATFORM_DOMAINS[0];
    return {
      hostname: defaultHost,
      port: null,
      isSubdomain: false,
      subdomain: null,
      apexHost: defaultHost,
      mainDomain: defaultHost,
      isPlatformDomain: true,
      isCustomDomain: false,
      isReserved: false,
      catalogSlug: null,
    };
  }

  // Local development / direct IP access
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
  ) {
    return {
      hostname,
      port: port || null,
      isSubdomain: false,
      subdomain: null,
      apexHost: host,
      mainDomain: hostname,
      isPlatformDomain: true,
      isCustomDomain: false,
      isReserved: false,
      catalogSlug: null,
    };
  }

  // Local development subdomain (e.g. xyz.localhost)
  if (hostname.endsWith(".localhost")) {
    const subdomain = hostname.slice(0, -10);
    const isReserved = isReservedSubdomain(subdomain);
    return {
      hostname,
      port: port || null,
      isSubdomain: Boolean(subdomain),
      subdomain: subdomain || null,
      apexHost: `localhost${portSuffix}`,
      mainDomain: "localhost",
      isPlatformDomain: true,
      isCustomDomain: false,
      isReserved,
      catalogSlug: !isReserved && subdomain ? subdomain : null,
    };
  }

  // Platform apex domains or subdomains
  for (const plat of platformDomains) {
    if (hostname === plat) {
      return {
        hostname,
        port: port || null,
        isSubdomain: false,
        subdomain: null,
        apexHost: `${plat}${portSuffix}`,
        mainDomain: plat,
        isPlatformDomain: true,
        isCustomDomain: false,
        isReserved: false,
        catalogSlug: null,
      };
    }
    if (hostname.endsWith(`.${plat}`)) {
      const subdomain = hostname.slice(0, -(plat.length + 1));
      const isReserved = isReservedSubdomain(subdomain);
      return {
        hostname,
        port: port || null,
        isSubdomain: true,
        subdomain,
        apexHost: `${plat}${portSuffix}`,
        mainDomain: plat,
        isPlatformDomain: true,
        isCustomDomain: false,
        isReserved,
        catalogSlug: !isReserved && subdomain ? subdomain : null,
      };
    }
  }

  // Custom domain support (e.g. www.xyzstore.com or xyzstore.com)
  const cleanCustomDomain = hostname.startsWith("www.")
    ? hostname.slice(4)
    : hostname;

  return {
    hostname,
    port: port || null,
    isSubdomain: false,
    subdomain: null,
    apexHost: host,
    mainDomain: hostname,
    isPlatformDomain: false,
    isCustomDomain: true,
    customDomain: hostname,
    isReserved: false,
    catalogSlug: cleanCustomDomain,
  };
}

export function getMainDomainUrl(path = "/", currentUrlOrHost) {
  const protocol =
    typeof window !== "undefined" ? window.location.protocol : "http:";
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
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

export function redirectToMainDomain(path = "/") {
  if (typeof window !== "undefined") {
    window.location.href = getMainDomainUrl(path);
  }
}

// Resolves centralized dashboard URL on the main platform domain
export function getDashboardUrl(
  _tenant,
  path = "/dashboard",
  currentUrlOrHost
) {
  const cleanPath = path
    ? path.startsWith("/")
      ? path
      : `/${path}`
    : "/dashboard";
  return getMainDomainUrl(cleanPath, currentUrlOrHost);
}

// Resolves public catalog URL on wildcard subdomain
export function getCatalogUrl(
  subdomainOrCatalogId,
  path = "/",
  currentUrlOrHost
) {
  const protocol =
    typeof window !== "undefined" ? window.location.protocol : "http:";
  const domainInfo = getDomainInfo(currentUrlOrHost);
  const apexHost = domainInfo.apexHost || "dragbizz.local";
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";

  if (!subdomainOrCatalogId) {
    return `${protocol}//${apexHost}${cleanPath}`;
  }

  return `${protocol}//${subdomainOrCatalogId}.${apexHost}${cleanPath}`;
}

// Prevents open redirects and maps legacy subdomain dashboard URLs to main domain
export function sanitizeRedirectUrl(
  targetUrl,
  fallbackPath = "/dashboard"
) {
  if (!targetUrl || typeof targetUrl !== "string") {
    return fallbackPath;
  }

  const trimmed = targetUrl.trim();

  // Reject protocol-relative URLs (//evil.com)
  if (trimmed.startsWith("//")) {
    return fallbackPath;
  }

  // Same-origin relative path
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const domainInfo = getDomainInfo(parsed.host);

    if (domainInfo.isPlatformDomain) {
      if (domainInfo.isSubdomain && parsed.pathname.startsWith("/dashboard")) {
        return `${parsed.protocol}//${domainInfo.apexHost}${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
      return trimmed;
    }

    return fallbackPath;
  } catch {
    return fallbackPath;
  }
}
