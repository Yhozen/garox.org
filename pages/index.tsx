import { motion } from 'framer-motion'
import Head from 'next/head'
import styled from 'styled-components'

import Me from '../components/Me'
import { Window } from '../components/window'

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
  return (
    <>
      <Head>
        <title>Portfolio</title>
      </Head>
      <Chess>
        <motion.div drag dragMomentum={false}>
          <Me />
        </motion.div>
        <div>
          {[0, 1, 2].map(value => (
            <motion.div key={value} drag dragMomentum={false}>
              <Paper>
                <h3>This is Nicht a sheet of paper.</h3>
                <p>
                  Lorem ipsum. At vero eos et accusam et justo duo dolores et ea
                  rebum.
                </p>
              </Paper>
            </motion.div>
          ))}
        </div>
        <Window />
      </Chess>
    </>
  )
}

export default Home
