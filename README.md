# use-fetchly

A lightweight React data fetching hook with smart caching and revalidation.

## Installation

You can install `use-fetchly` using npm, yarn, or pnpm.

```bash
npm install use-fetchly
# or
yarn add use-fetchly
# or
pnpm add use-fetchly
```

## Usage

Here is a basic example of how to use `use-fetchly` in your React components.

```tsx
import { useFetchly } from 'use-fetchly';

function MyComponent() {
  const { data, error, loading, revalidate } = useFetchly('/api/data');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={revalidate}>Refresh</button>
    </div>
  );
}
```

## Features

- **Lightweight**: Minimal bundle size impact.
- **Smart Caching**: Efficiently caches responses to minimize network requests.
- **Revalidation**: Easy-to-use revalidation strategies to keep data fresh.
- **TypeScript Support**: Fully typed for a great developer experience.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
