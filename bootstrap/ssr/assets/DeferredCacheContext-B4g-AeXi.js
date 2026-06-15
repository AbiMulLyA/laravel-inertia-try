import "react/jsx-runtime";
import { createContext, useContext } from "react";
//#region resources/js/Contexts/DeferredCacheContext.tsx
var DeferredCacheContext = createContext(null);
/**
* Hook to access the deferred cache.
*/
function useDeferredCache() {
	const context = useContext(DeferredCacheContext);
	if (!context) throw new Error("useDeferredCache must be used within DeferredCacheProvider");
	return context;
}
/**
* Hook to get cached data or use fresh data from props.
* 
* @param key - Unique cache key (e.g., 'dashboard.overview')
* @param data - Fresh data from Inertia props (may be undefined if deferred)
* @param options - Cache options
* @returns Cached data or fresh data, and loading state
*/
function useCachedDeferred(key, data, options = {}) {
	const cache = useDeferredCache();
	if (data !== void 0) {
		cache.set(key, data, options.ttl);
		return {
			data,
			isFromCache: false,
			isLoading: false
		};
	}
	const cachedData = cache.get(key);
	if (cachedData !== null) return {
		data: cachedData,
		isFromCache: true,
		isLoading: false
	};
	return {
		data: null,
		isFromCache: false,
		isLoading: true
	};
}
//#endregion
export { useDeferredCache as n, useCachedDeferred as t };
