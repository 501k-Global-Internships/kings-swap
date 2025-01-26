import React from 'react'
import { SwapExchangeLayout } from './_component/SwapExchangeLayout'
import { ExchangeProvider } from './_component/ExchangeContext';

const SwapExchange = () => {
  return (
    <ExchangeProvider>
      <SwapExchangeLayout />
    </ExchangeProvider>
  );
}

export default SwapExchange