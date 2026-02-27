export interface FetchlyOptions {
    headers?: Record<string, string>;
    method?: string;
    body?: any;
    cacheTime?: number; // in milliseconds
}

export interface FetchlyResult<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
    revalidate: () => Promise<void>;
}
