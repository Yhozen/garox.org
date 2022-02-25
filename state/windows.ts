import create from 'zustand'

type WindowView = {
  id: string
  x: number
  y: number
  isOpen: boolean
}

type WindowsViewState = {
  windows: Record<string, WindowView>
  setWindows: (id: string, properties: Partial<WindowView>) => void
}

const INITIAL_WINDOWS: Record<string, WindowView> = {
  me: { id: 'me', x: 100, y: 100, isOpen: false },
}

export const useStore = create<WindowsViewState>(set => ({
  windows: INITIAL_WINDOWS,
  setWindows: (id, properties) =>
    set(state => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], ...properties },
      },
    })),
}))

const windowsSelector = (state: WindowsViewState) => state.windows

export const useWindows = () => useStore(windowsSelector)
