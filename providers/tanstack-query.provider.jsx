'use client';

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    }
  },
});

export default function TanstackQueryProvider({ children }) {

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}