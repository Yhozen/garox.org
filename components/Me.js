import React, { useMemo } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import LinearProgress from '@material-ui/core/LinearProgress'
import Dayjs from 'dayjs'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[500],
    },
  },
})

const nacimiento = Dayjs('1998-07-28')

const Me = (props) => {
  const { classes } = props
  const now = useMemo(() => Dayjs(), [])
  const años = useMemo(() => now.diff(nacimiento, 'years', true), [now])
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image="https://avatars1.githubusercontent.com/u/6902134"
        title="Contemplative Reptile"
      />
      <CardContent>
        <Typography variant="headline" component="h2">
          Gabriel Pérez
        </Typography>
        <Typography gutterBottom variant="subheading" component="h5">
          {años | 0} years old
        </Typography>
        <MuiThemeProvider theme={theme}>
          <LinearProgress
            variant="determinate"
            value={(años % 1) * 100}
            style={{ marginBottom: '1em' }}
          />
        </MuiThemeProvider>
        <Typography component="p">
          A programmer orem ipsum dolor sit amet, consetetur sadipscing elitr,
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
          aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
          dolores et ea rebum.
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Me
