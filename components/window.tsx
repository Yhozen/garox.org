import { useState } from 'react'
import { motion } from 'framer-motion'

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '-100%' },
}

export const Window = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <motion.div animate={isOpen ? 'open' : 'closed'} variants={variants}>
      <button onClick={() => setIsOpen(isOpen => !isOpen)}>aa</button>
      ss
    </motion.div>
  )
}
