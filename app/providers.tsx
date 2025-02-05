'use client';

import { base, arbitrum, mainnet } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';

export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={mainnet}
          config={{ appearance: { 
            mode: 'auto',
        }
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}

