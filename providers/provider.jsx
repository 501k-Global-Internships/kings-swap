"use client";

import TanstackQueryProvider from "./tanstack-query.provider";



export default function Provider({ children }) {
  return (
    <TanstackQueryProvider>
        {/* TODO: add other provider here */}
      {children}
    </TanstackQueryProvider>
  );
}
