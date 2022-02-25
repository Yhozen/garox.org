import Head from 'next/head'
import { Fragment, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { Window } from '../components/window'
import { useStore } from '../state/windows'
import { Apps } from '../App'

const Chess = styled.div`
  min-width: 99vw;
  min-height: 99vh;
  overflow: hidden;

  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  background: repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% /
    0.25rem 0.25rem;
`

const Home = () => {
  const { setWindows, constrainRef, setConstrainRef } = useStore()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setConstrainRef(containerRef)
  }, [constrainRef])

  return (
    <>
      <Head>
        <title>Portfolio</title>
      </Head>
      <Chess ref={containerRef}>
        {Apps.map(({ id, Component, icon }) => (
          <Fragment key={id}>
            <div onClick={() => setWindows(id, { isOpen: true })}>
              {icon({ id })}
            </div>
            <Window id={id}>
              <Component />
            </Window>
          </Fragment>
        ))}
      </Chess>
    </>
  )
}

export default Home
