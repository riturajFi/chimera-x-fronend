// global.d.ts
export {};

declare global {
  interface Window {
    ethereum?: any; // or a more specific type from '@metamask/providers'
  }
}
