import type { FC } from 'react'
import { motion } from 'framer-motion'
import { useConstrainRef, useWindows } from '../state/windows'
import styled from 'styled-components'

const variants = {
  open: { opacity: 1, x: 0, scale: 1, height: 500, width: 500 },
  closed: { opacity: 0, x: '-100%', scale: 0.1, height: 50, width: 50 },
}

type WindowProps = {
  id: string
}

const WindowContainer = styled(motion.div)`
  position: absolute;
`

export const Window: FC<WindowProps> = ({ id, children }) => {
  const windows = useWindows()
  const constrainRef = useConstrainRef()

  const optional = constrainRef ? { dragConstraints: constrainRef } : {}

  console.log(optional)

  return (
    <WindowContainer
      drag
      {...optional}
      dragMomentum={false}
      animate={windows[id]?.isOpen ? 'open' : 'closed'}
      transition={{ ease: 'easeInOut' }}
      variants={variants}>
      {children}
    </WindowContainer>
  )
}
