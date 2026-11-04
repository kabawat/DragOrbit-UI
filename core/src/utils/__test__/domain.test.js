import assert from "node:assert/strict";
import test from "node:test";
import {
  getDomainInfo,
  getDashboardUrl,
  getCatalogUrl,
  sanitizeRedirectUrl,
  isReservedSubdomain,
} from "../domain.js";

test("getDomainInfo resolves platform domains (development & production)", () => {
  // Development apex
  const devApex = getDomainInfo("dragbizz.local");
  assert.equal(devApex.isPlatformDomain, true);
  assert.equal(devApex.isSubdomain, false);
  assert.equal(devApex.mainDomain, "dragbizz.local");
  assert.equal(devApex.apexHost, "dragbizz.local");

  // Production apex dragbizz.io
  const prodApexIo = getDomainInfo("dragbizz.io");
  assert.equal(prodApexIo.isPlatformDomain, true);
  assert.equal(prodApexIo.isSubdomain, false);
  assert.equal(prodApexIo.mainDomain, "dragbizz.io");

  // Production apex dragbizz.com
  const prodApexCom = getDomainInfo("dragbizz.com");
  assert.equal(prodApexCom.isPlatformDomain, true);
  assert.equal(prodApexCom.isSubdomain, false);
  assert.equal(prodApexCom.mainDomain, "dragbizz.com");
});

test("getDomainInfo resolves wildcard catalog subdomains", () => {
  // Development catalog subdomain
  const devSub = getDomainInfo("xyz.dragbizz.local");
  assert.equal(devSub.isPlatformDomain, true);
  assert.equal(devSub.isSubdomain, true);
  assert.equal(devSub.subdomain, "xyz");
  assert.equal(devSub.catalogSlug, "xyz");
  assert.equal(devSub.apexHost, "dragbizz.local");
  assert.equal(devSub.isReserved, false);

  // Production catalog subdomain on .io
  const prodSubIo = getDomainInfo("xyz.dragbizz.io");
  assert.equal(prodSubIo.isPlatformDomain, true);
  assert.equal(prodSubIo.isSubdomain, true);
  assert.equal(prodSubIo.subdomain, "xyz");
  assert.equal(prodSubIo.catalogSlug, "xyz");
  assert.equal(prodSubIo.apexHost, "dragbizz.io");

  // Production catalog subdomain on .com
  const prodSubCom = getDomainInfo("abc.dragbizz.com");
  assert.equal(prodSubCom.isPlatformDomain, true);
  assert.equal(prodSubCom.isSubdomain, true);
  assert.equal(prodSubCom.subdomain, "abc");
  assert.equal(prodSubCom.catalogSlug, "abc");
  assert.equal(prodSubCom.apexHost, "dragbizz.com");

  // Reserved subdomain on platform domain
  const reservedSub = getDomainInfo("dashboard.dragbizz.local");
  assert.equal(reservedSub.isSubdomain, true);
  assert.equal(reservedSub.subdomain, "dashboard");
  assert.equal(reservedSub.isReserved, true);
  assert.equal(reservedSub.catalogSlug, null);
});

test("getDomainInfo handles custom domains extensibly", () => {
  const custom = getDomainInfo("www.xyzstore.com");
  assert.equal(custom.isPlatformDomain, false);
  assert.equal(custom.isCustomDomain, true);
  assert.equal(custom.catalogSlug, "xyzstore.com");

  const nakedCustom = getDomainInfo("xyzstore.com");
  assert.equal(nakedCustom.isPlatformDomain, false);
  assert.equal(nakedCustom.isCustomDomain, true);
  assert.equal(nakedCustom.catalogSlug, "xyzstore.com");
});

test("getDashboardUrl always resolves to centralized main domain", () => {
  const devUrl = getDashboardUrl("xyz", "/dashboard", "http://xyz.dragbizz.local");
  assert.match(devUrl, /\/\/dragbizz\.local\/dashboard/);

  const prodUrl = getDashboardUrl("xyz", "/dashboard", "https://xyz.dragbizz.io");
  assert.match(prodUrl, /\/\/dragbizz\.io\/dashboard/);
});

test("getCatalogUrl resolves to wildcard catalog subdomain", () => {
  const devCat = getCatalogUrl("xyz", "/", "dragbizz.local");
  assert.match(devCat, /\/\/xyz\.dragbizz\.local/);

  const prodCat = getCatalogUrl("abc", "/", "dragbizz.io");
  assert.match(prodCat, /\/\/abc\.dragbizz\.io/);
});

test("sanitizeRedirectUrl prevents open redirects and rewrites legacy dashboard URLs", () => {
  // Safe relative paths
  assert.equal(sanitizeRedirectUrl("/dashboard"), "/dashboard");
  assert.equal(sanitizeRedirectUrl("/dashboard/products"), "/dashboard/products");

  // Protocol-relative attack
  assert.equal(sanitizeRedirectUrl("//attacker.com/steal"), "/dashboard");

  // External arbitrary host attack
  assert.equal(sanitizeRedirectUrl("https://evil.com/login"), "/dashboard");

  // Legacy tenant subdomain dashboard URL is safely rewritten to centralized dashboard
  const rewritten = sanitizeRedirectUrl("http://xyz.dragbizz.local/dashboard");
  assert.equal(rewritten, "http://dragbizz.local/dashboard");

  const rewrittenProd = sanitizeRedirectUrl("https://xyz.dragbizz.io/dashboard/sales?period=today");
  assert.equal(rewrittenProd, "https://dragbizz.io/dashboard/sales?period=today");
});

test("isReservedSubdomain checks reserved system subdomains", () => {
  assert.equal(isReservedSubdomain("dashboard"), true);
  assert.equal(isReservedSubdomain("login"), true);
  assert.equal(isReservedSubdomain("admin"), true);
  assert.equal(isReservedSubdomain("api"), true);
  assert.equal(isReservedSubdomain("store123"), false);
  assert.equal(isReservedSubdomain("acme"), false);
});
