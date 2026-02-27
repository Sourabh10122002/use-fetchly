import { useState, useEffect, useCallback, useRef } from 'react';
import { FetchlyOptions, FetchlyResult } from './types';

// Global cache storage
const cache = new Map<string, { data: any; timestamp: number }>();

export function useFetchly<T = any>(
    url: string,
    options: FetchlyOptions = {}
): FetchlyResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const optionsRef = useRef(options);
    optionsRef.current = options;

    const fetchData = useCallback(async (ignoreCache = false) => {
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

        try {
            const response = await fetch(url, {
                method: optionsRef.current.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...optionsRef.current.headers,
                },
                body: optionsRef.current.body ? JSON.stringify(optionsRef.current.body) : undefined,
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
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const revalidate = useCallback(async () => {
        await fetchData(true);
    }, [fetchData]);

    return { data, error, loading, revalidate };
}
