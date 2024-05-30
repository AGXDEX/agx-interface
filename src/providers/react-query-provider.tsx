import { FC, PropsWithChildren, ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryWrapper } from './query-error';

const QueryProvider:FC<PropsWithChildren<{ children: ReactNode; dehydratedState?: any }>> = ({
  children,
  dehydratedState,
}) => {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          // Set a stale time of 10 seconds so query results don't get wiped out of
          // the cache instantly after their hook unmounts (see documentation for
          // more info: https://react-query.tanstack.com/guides/important-defaults)
          staleTime: 10000,
          // onError: logError,
        },
        mutations: {
          // onError: logError,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={client}>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ resetErrorBoundary }) => <ErrorBoundaryWrapper reset={resetErrorBoundary} />}
            >
              {children}
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default QueryProvider;
