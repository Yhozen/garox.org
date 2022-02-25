import { useMemo } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import Progress2 from 'https://framer.com/m/Progress-aSAM.js@XZn0bOO53MVEePYoGtKu'
import styled from 'styled-components'

const DATE_OF_BIRTH = dayjs('1998-07-28')

const Progress = styled(motion.progress)`
  margin-bottom: 1em;
  width: 100%;
`

const Me = props => {
  const { classes } = props
  const age = useMemo(() => dayjs().diff(DATE_OF_BIRTH, 'years', true), [])

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image="https://avatars1.githubusercontent.com/u/6902134"
        title="Garox"
      />
      <CardContent>
        <h2>Gabriel Pérez</h2>
        <h5>{age | 0} years old</h5>
        <div style={{ background: 'red' }}>
          <Progress
            initial={{ value: 0 }}
            max={100}
            animate={{ value: (age % 1) * 100 }}
          />
          <Progress2 />
        </div>
        <p>
          A programmer orem ipsum dolor sit amet, consetetur sadipscing elitr,
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
          aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
          dolores et ea rebum.
        </p>
      </CardContent>
    </Card>
  )
}

export default Me
