import Me from './components/introduction'
import { Icon } from './components/icon'
import { IconProps } from './types/IconProps'
import { Sheet } from './components/sheet'
import { Spotify } from './components/spotify'

type App = {
  id: string
  Component: () => JSX.Element
  icon: ({ id }: IconProps) => JSX.Element
}

export const Apps: App[] = [
  { id: 'me', Component: Me, icon: Icon },
  { id: `sheet-0`, Component: Sheet, icon: Icon },
  { id: `sheet-1`, Component: Sheet, icon: Icon },
  { id: `sheet-2`, Component: Sheet, icon: Icon },
  { id: `spotify`, Component: Spotify, icon: Icon },
]
