import React, { createContext, useContext, useCallback, useRef, useEffect } from 'react';

interface CacheEntry<T = unknown> {
    data: T;
    timestamp: number;
    key: string;
}

interface DeferredCacheContextValue {
    get: <T>(key: string) => T | null;
    set: <T>(key: string, data: T, ttl?: number) => void;
    has: (key: string) => boolean;
    invalidate: (pattern?: string) => void;
    invalidateByUrl: (url: string) => void;
}

const DeferredCacheContext = createContext<DeferredCacheContextValue | null>(null);

// Default TTL: 5 minutes
const DEFAULT_TTL = 5 * 60 * 1000;

interface DeferredCacheProviderProps {
    children: React.ReactNode;
    defaultTtl?: number;
}

/**
 * Provider for caching deferred props data.
 * 
 * Features:
 * - In-memory cache with TTL
 * - Auto-invalidation on CRUD operations
 * - Pattern-based invalidation
 */
export function DeferredCacheProvider({ 
    children, 
    defaultTtl = DEFAULT_TTL 
}: DeferredCacheProviderProps) {
    const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
    const ttlRef = useRef(defaultTtl);

    // Check if cache entry is still valid
    const isValid = useCallback((entry: CacheEntry): boolean => {
        return Date.now() - entry.timestamp < ttlRef.current;
    }, []);

    // Get cached data
    const get = useCallback(<T,>(key: string): T | null => {
        const entry = cacheRef.current.get(key);
        if (entry && isValid(entry)) {
            console.log(`[Cache] HIT: ${key}`);
            return entry.data as T;
        }
        if (entry) {
            console.log(`[Cache] STALE: ${key}`);
            cacheRef.current.delete(key);
        }
        return null;
    }, [isValid]);

    // Set cache data
    const set = useCallback(<T,>(key: string, data: T, ttl?: number): void => {
        console.log(`[Cache] SET: ${key}`);
        cacheRef.current.set(key, {
            data,
            timestamp: Date.now(),
            key,
        });
        
        // Custom TTL for this entry
        if (ttl) {
            setTimeout(() => {
                cacheRef.current.delete(key);
            }, ttl);
        }
    }, []);

    // Check if key exists and is valid
    const has = useCallback((key: string): boolean => {
        const entry = cacheRef.current.get(key);
        return entry ? isValid(entry) : false;
    }, [isValid]);

    // Invalidate cache by pattern (e.g., 'dashboard.*' or 'projects.*')
    const invalidate = useCallback((pattern?: string): void => {
        if (!pattern) {
            console.log('[Cache] CLEAR ALL');
            cacheRef.current.clear();
            return;
        }

        const regex = new RegExp(pattern.replace('*', '.*'));
        const keysToDelete: string[] = [];
        
        cacheRef.current.forEach((_, key) => {
            if (regex.test(key)) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach(key => {
            console.log(`[Cache] INVALIDATE: ${key}`);
            cacheRef.current.delete(key);
        });
    }, []);

    // Invalidate cache for specific URL pattern
    const invalidateByUrl = useCallback((url: string): void => {
        const urlPattern = url.replace(/\//g, '.').replace(/^\./, '');
        invalidate(`${urlPattern}.*`);
    }, [invalidate]);

    // Auto-invalidate on successful mutations (POST, PUT, PATCH, DELETE)
    useEffect(() => {
        const handleSuccess = (event: CustomEvent<{ visit: { method: string; url: URL } }>) => {
            const method = event.detail.visit.method.toUpperCase();
            const url = event.detail.visit.url.pathname;

            // Invalidate cache on mutations
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
                console.log(`[Cache] Mutation detected: ${method} ${url}`);
                
                // Invalidate related caches
                if (url.includes('/projects')) {
                    invalidate('projects.*');
                    invalidate('dashboard.*'); // Dashboard might show project stats
                }
                if (url.includes('/categories')) {
                    invalidate('categories.*');
                    invalidate('projects.*'); // Projects have category filter
                    invalidate('dashboard.*');
                }
                if (url.includes('/tasks')) {
                    invalidate('tasks.*');
                    invalidate('dashboard.*');
                }
            }
        };

        document.addEventListener('inertia:success', handleSuccess as unknown as EventListener);
        return () => {
            document.removeEventListener('inertia:success', handleSuccess as unknown as EventListener);
        };
    }, [invalidate]);

    const value: DeferredCacheContextValue = {
        get,
        set,
        has,
        invalidate,
        invalidateByUrl,
    };

    return (
        <DeferredCacheContext.Provider value={value}>
            {children}
        </DeferredCacheContext.Provider>
    );
}

/**
 * Hook to access the deferred cache.
 */
export function useDeferredCache() {
    const context = useContext(DeferredCacheContext);
    if (!context) {
        throw new Error('useDeferredCache must be used within DeferredCacheProvider');
    }
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
export function useCachedDeferred<T>(
    key: string,
    data: T | undefined,
    options: { ttl?: number } = {}
): { data: T | null; isFromCache: boolean; isLoading: boolean } {
    const cache = useDeferredCache();
    
    // If fresh data is available, cache it and return
    if (data !== undefined) {
        cache.set(key, data, options.ttl);
        return { data, isFromCache: false, isLoading: false };
    }

    // Try to get from cache
    const cachedData = cache.get<T>(key);
    if (cachedData !== null) {
        return { data: cachedData, isFromCache: true, isLoading: false };
    }

    // No data available yet (still loading)
    return { data: null, isFromCache: false, isLoading: true };
}

export { DeferredCacheContext };
