import { useMemo } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import green from '@material-ui/core/colors/green'
import LinearProgress from '@material-ui/core/LinearProgress'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import dayjs from 'dayjs'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[500],
    },
  },
})

const DATE_OF_BIRTHDAY = dayjs('1998-07-28')

const Me = props => {
  const { classes } = props
  const age = useMemo(() => dayjs().diff(DATE_OF_BIRTHDAY, 'years', true), [])

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
        <MuiThemeProvider theme={theme}>
          <LinearProgress
            variant="determinate"
            value={(age % 1) * 100}
            style={{ marginBottom: '1em' }}
          />
        </MuiThemeProvider>
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
