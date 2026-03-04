export interface FetchlyOptions {
    headers?: Record<string, string>;
    method?: string;
    body?: any;
    cacheTime?: number; // in milliseconds
    revalidateOnFocus?: boolean;
    revalidateOnReconnect?: boolean;
    retryCount?: number;
    retryDelay?: number;
    refreshInterval?: number;
    shouldRetry?: (error: any) => boolean;
}

export interface FetchlyResult<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
    revalidate: () => Promise<void>;
}

export interface FetchlyContextType {
    defaults?: FetchlyOptions;
}
