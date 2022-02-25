import { motion } from 'framer-motion'
import Head from 'next/head'
import styled from 'styled-components'

import Me from '../components/me'
import { Window } from '../components/window'
import { useStore } from '../state/windows'

const Chess = styled.div`
  min-width: 99vw;
  min-height: 99vh;

  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  background: repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% /
    0.25rem 0.25rem;
`

const Paper = styled.div`
  width: 10rem;
  background: white;
  padding: 0.4rem;
  border-radius: 0.3rem;
`

const Home = () => {
  const { setWindows } = useStore()
  return (
    <>
      <Head>
        <title>Portfolio</title>
      </Head>
      <Chess>
        <Window id="me">
          <Me />
        </Window>

        <button onClick={() => setWindows('me', { isOpen: true })}>open</button>
        <button onClick={() => setWindows('me', { isOpen: false })}>
          close
        </button>

        <div>
          {[0, 1, 2].map(value => (
            <Window key={value} id={`sheet-${value}`}>
              <Paper>
                <h3>This is Nicht ae sheet of paper.</h3>
                <p>
                  Lorem ipsum. At vero eos et accusam et justo duo dolores et ea
                  rebum.
                </p>
              </Paper>
            </Window>
          ))}
        </div>
      </Chess>
    </>
  )
}

export default Home
