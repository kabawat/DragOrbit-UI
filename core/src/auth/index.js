// A cookie hint controls presentation only. APIs remain the authentication authority.
export function hasSessionHint(cookie = "") {
	return cookie.split(";").some((part) => part.trim() === "logged_in=true");
}

const bootstraps = new WeakMap();
function waitForRequest(store, field) {
	if (!store.getState().profile[field]) return Promise.resolve();
	return new Promise((resolve) => {
		const unsubscribe = store.subscribe(() => {
			if (!store.getState().profile[field]) {
				unsubscribe();
				resolve();
			}
		});
	});
}

export function bootstrapSession(
	store,
	actions,
	{ sessionHint, force = false } = {},
) {
	if (bootstraps.has(store)) return bootstraps.get(store);
	if (!sessionHint && !store.getState().profile.authProfile) {
		store.dispatch(actions.setInitialized(true));
		return Promise.resolve();
	}
	const run = async () => {
		try {
			let profile = store.getState().profile;
			if (profile.authProfileLoading)
				await waitForRequest(store, "authProfileLoading");
			else if (force || !profile.authProfile)
				await store.dispatch(actions.getAuthProfile());
			profile = store.getState().profile;
			if (!profile.isAuthenticated || !profile.authProfile) return;
			const requests = [];
			if (profile.authProfile.agencyId) {
				if (profile.isLoading)
					requests.push(waitForRequest(store, "isLoading"));
				else if (force || !profile.retailerInitialized)
					requests.push(
						store.dispatch(actions.getRetailerDetails({ forceRefresh: force })),
					);
			}
			if (profile.authProfile.role === "store_staff") {
				if (profile.staffProfileLoading)
					requests.push(waitForRequest(store, "staffProfileLoading"));
				else if (force || !profile.staffProfile)
					requests.push(store.dispatch(actions.getStaffProfileDetails()));
			}
			await Promise.all(requests);
		} finally {
			store.dispatch(actions.setInitialized(true));
		}
	};
	const promise = Promise.resolve()
		.then(run)
		.finally(() => bootstraps.delete(store));
	bootstraps.set(store, promise);
	return promise;
}

export function sessionDecision(
	profile,
	{ guest = false, sessionHint = true, pathname = "/dashboard" } = {},
) {
	// A cached guest layout may predate login; a false hint must not override
	// an account already verified in this runtime.
	if (
		guest &&
		!sessionHint &&
		!profile.authProfile &&
		!profile.authProfileLoading
	)
		return { state: "ready" };
	if (
		profile.authProfileErrorStatus === 401 ||
		profile.retailerErrorStatus === 401
	) {
		return guest
			? { state: "ready" }
			: {
					state: "redirect",
					to: `/login?redirect=${encodeURIComponent(pathname)}`,
				};
	}
	const authError =
		profile.authProfileError &&
		profile.authProfileErrorStatus !== 401 &&
		!profile.authProfile;
	const workspaceError =
		profile.error &&
		profile.retailerErrorStatus !== 401 &&
		!profile.retailerInitialized;
	if (authError || workspaceError)
		return {
			state: "error",
			message: profile.authProfileError || profile.error,
		};
	if (
		(!profile.isInitialized || profile.authProfileLoading) &&
		!profile.authProfile
	)
		return { state: "loading" };
	if (
		guest &&
		sessionHint &&
		!profile.authProfile &&
		profile.authProfileStatus === "idle"
	)
		return { state: "loading" };
	if (!profile.isAuthenticated || !profile.authProfile) {
		return guest
			? { state: "ready" }
			: {
					state: "redirect",
					to: `/login?redirect=${encodeURIComponent(pathname)}`,
				};
	}
	let destination;
	if (!profile.authProfile.agencyId) destination = "/onboarding/agency";
	else {
		if (!profile.retailerInitialized) return { state: "loading" };
		if (!profile.agency) destination = "/onboarding/agency";
		else if (!profile.stores?.length) destination = "/onboarding/store";
		else if (guest || pathname.startsWith("/onboarding"))
			destination = "/dashboard";
	}
	if (
		destination &&
		pathname !== destination &&
		!pathname.startsWith(`${destination}/`)
	)
		return { state: "redirect", to: destination };
	return { state: "ready" };
}

// One recovery for all concurrent 401s in this browser runtime. Each request
// can retry once, including requests that joined a recovery already in flight.
export function createSessionRecovery({ refresh, onExpired }) {
	let inFlight = null;
	return async (error, retry) => {
		const request = error?.config;
		if (error?.response?.status !== 401 || !request || request._retry)
			throw error;
		request._retry = true;
		if (!inFlight) {
			inFlight = Promise.resolve()
				.then(refresh)
				.then((result) => {
					if (result?.success) return;
					const failure = new Error(
						result?.message || "Unable to restore session.",
					);
					failure.response = {
						status: result?.statusCode ?? null,
						data: result?.error || { message: failure.message },
					};
					if (failure.response.status === 401) onExpired?.();
					throw failure;
				})
				.finally(() => {
					inFlight = null;
				});
		}
		await inFlight;
		return retry(request);
	};
}
