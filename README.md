# use-fetchly

A lightweight, powerful React data fetching hook with smart caching, auto-revalidation, and request cancellation.

## Features

- 🚀 **Lightweight**: Minimal footprint.
- 📦 **Smart Caching**: In-memory caching with configurable time.
- 🔄 **Auto-revalidation**: Re-fetch on focus and network reconnection.
- 🛡️ **Request Cancellation**: Uses `AbortController` to prevent stale updates.
- 🔁 **Retry Logic**: Configurable retries for failed requests.
- ⏱️ **Polling**: Efficient periodic data refreshing.
- 🌍 **Global Configuration**: Set defaults via `FetchlyProvider`.

## Installation

```bash
npm install use-fetchly
```

## Basic Usage

```tsx
import { useFetchly } from 'use-fetchly';

function UserProfile({ id }) {
  const { data, loading, error, revalidate } = useFetchly(`https://api.example.com/users/${id}`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={() => revalidate()}>Refresh</button>
    </div>
  );
}
```

## Advanced Configuration

### Global Provider

Wrap your app with `FetchlyProvider` to set default options for all hooks.

```tsx
import { FetchlyProvider } from 'use-fetchly';

function App() {
  return (
    <FetchlyProvider defaults={{ cacheTime: 60000, retryCount: 3 }}>
      <YourApp />
    </FetchlyProvider>
  );
}
```

### Hook Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `method` | `string` | `'GET'` | HTTP method. |
| `headers` | `Record<string, string>` | `{}` | Custom headers. |
| `body` | `any` | `undefined` | Request body. |
| `cacheTime` | `number` | `undefined` | Cache duration in ms. |
| `revalidateOnFocus` | `boolean` | `false` | Re-fetch when window regains focus. |
| `revalidateOnReconnect` | `boolean` | `false` | Re-fetch when network reconnects. |
| `retryCount` | `number` | `0` | Number of retries on failure. |
| `retryDelay` | `number` | `1000` | Delay between retries in ms. |
| `refreshInterval` | `number` | `undefined` | Polling interval in ms. |
| `shouldRetry` | `(error: any) => boolean` | `undefined` | Custom retry logic. |

## License

MIT
