import { StartupLoader } from "./StartupLoader";

/** Compatibility alias: session verification always uses the branded startup screen. */
export function SessionSkeleton() {
	return <StartupLoader />;
}
