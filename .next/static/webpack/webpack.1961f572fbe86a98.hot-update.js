// File: C:\Users\ritur\OneDrive\Documents\__Code\Personal Projects\Learn Web3\my-onchainkit-app\app\page.tsx
import * as entry from '../../../app/page.js'
import type { ResolvingMetadata, ResolvingViewport } from 'next/dist/lib/metadata/types/metadata-interface.js'

type TEntry = typeof import('../../../app/page.js')

// Check that the entry is a valid entry
checkFields<Diff<{
  default: Function
  config?: {}
  generateStaticParams?: Function
  revalidate?: RevalidateRange<TEntry> | false
  dynamic?: 'auto' | 'force-dynamic' | 'error' | 'force-static'
  dynamicParams?: boolean
  fetchCache?: 'auto' | 'force-no-store' | 'only-no-store' | 'default-no-store' | 'default-cache' | 'only-cache' | 'force-cache'
  preferredRegion?: 'auto' | 'global' | 'home' | string | string[]
  runtime?: 'nodejs' | 'experimental-edge' | 'edge'
  maxDuration?: number
 