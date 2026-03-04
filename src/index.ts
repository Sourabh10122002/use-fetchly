import { useState, useEffect, useCallback, useRef } from 'react';
import { FetchlyOptions, FetchlyResult } from './types';
import { useFetchlyContext } from './FetchlyContext';

// Global cache storage
const cache = new Map<string, { data: any; timestamp: number }>();

export function useFetchly<T = any>(
    url: string,
    options: FetchlyOptions = {}
): FetchlyResult<T> {
    const { defaults } = useFetchlyContext();
    const mergedOptions = { ...defaults, ...options };

    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const optionsRef = useRef(mergedOptions);
    optionsRef.current = mergedOptions;

    const fetchData = useCallback(async (ignoreCache = false, signal?: AbortSignal) => {
        setLoading(true);
        const cacheKey = `${optionsRef.current.method || 'GET'}:${url}:${JSON.stringify(optionsRef.current.body)}`;

        if (!ignoreCache && optionsRef.current.cacheTime) {
            const cached = cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < optionsRef.current.cacheTime) {
                setData(cached.data);
                setLoading(false);
                setError(null);
                return;
            }
        }

        let retryCount = 0;
        const maxRetries = optionsRef.current.retryCount || 0;
        const retryDelay = optionsRef.current.retryDelay || 1000;

        const executeFetch = async (): Promise<void> => {
            try {
                const response = await fetch(url, {
                    method: optionsRef.current.method || 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...optionsRef.current.headers,
                    },
                    body: optionsRef.current.body ? JSON.stringify(optionsRef.current.body) : undefined,
                    signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (optionsRef.current.cacheTime) {
                    cache.set(cacheKey, { data: result, timestamp: Date.now() });
                }

                setData(result);
                setError(null);
            } catch (err: any) {
                if (err.name === 'AbortError') return;

                const shouldRetry = optionsRef.current.shouldRetry
                    ? optionsRef.current.shouldRetry(err)
                    : retryCount < maxRetries;

                if (shouldRetry && retryCount < maxRetries) {
                    retryCount++;
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    return executeFetch();
                }

                setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                setLoading(false);
            }
        };

        await executeFetch();
    }, [url]);

    useEffect(() => {
        const controller = new AbortController();
        fetchData(false, controller.signal);

        const handleRevalidate = () => {
            if (optionsRef.current.revalidateOnFocus && document.visibilityState === 'visible') {
                fetchData(true, controller.signal);
            }
        };

        const handleReconnect = () => {
            if (optionsRef.current.revalidateOnReconnect) {
                fetchData(true, controller.signal);
            }
        };

        window.addEventListener('visibilitychange', handleRevalidate);
        window.addEventListener('focus', handleRevalidate);
        window.addEventListener('online', handleReconnect);

        let pollingInterval: any = null;
        if (optionsRef.current.refreshInterval) {
            pollingInterval = setInterval(() => {
                fetchData(true, controller.signal);
            }, optionsRef.current.refreshInterval);
        }

        return () => {
            controller.abort();
            window.removeEventListener('visibilitychange', handleRevalidate);
            window.removeEventListener('focus', handleRevalidate);
            window.removeEventListener('online', handleReconnect);
            if (pollingInterval) clearInterval(pollingInterval);
        };
    }, [fetchData]);

    const revalidate = useCallback(async () => {
        await fetchData(true);
    }, [fetchData]);

    return { data, error, loading, revalidate };
}
