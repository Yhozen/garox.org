import type { JSX } from 'react'

import Me from './components/introduction'
import { Sheet } from './components/sheet'
import { Spotify } from './components/spotify'
import { SpotifyComponent } from './components/spotify.icon'
import { IconProps } from './types/IconProps'

type App = {
  id: string
  Component: () => JSX.Element
  icon: ({ id }: IconProps) => JSX.Element
}

export const Apps: App[] = [
  { id: 'me', Component: Me, icon: SpotifyComponent },
  { id: `sheet-0`, Component: Sheet, icon: SpotifyComponent },
  { id: `sheet-1`, Component: Sheet, icon: SpotifyComponent },
  { id: `sheet-2`, Component: Sheet, icon: SpotifyComponent },
  { id: `spotify`, Component: Spotify, icon: SpotifyComponent },
]
