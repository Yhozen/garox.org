import React from 'react'
import Link from 'gatsby-link'
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import LinearProgress from '@material-ui/core/LinearProgress'
import Dayjs from 'dayjs'
import Tooltip from '@material-ui/core/Tooltip'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '85%',
  }
})
const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[500]
    }
  }
})
const now = Dayjs()
const nacimiento = Dayjs('1998-07-28')
const años = now.diff(nacimiento, 'years', true)
console.log(green[400])

const Me = (props) => {
  const { classes } = props
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
          <LinearProgress variant="determinate" value={(años % 1)*100 } style={{marginBottom: '1em'}}/>
        </MuiThemeProvider>
        <Typography component="p">
          A programmer orem ipsum
 dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
        </Typography>
        
      </CardContent>
    </Card>
  )
}

const IndexPage = (props) => {
  const { classes } = props
  return (
    <Grid container justify='center' alignItems='center' direction='column' style={{ padding: 20 }}>
      <Grid item xs={12}>
        <Me classes={classes}/>
      </Grid>
      <Grid item xs={12} style={{ padding: 20 }}>
        <Grid container spacing={24} justify="center">
          {[0, 1, 2].map(value => (
            <Grid key={value} item sm={4}>
              <Paper className={classes.paper} elevation={2}>
              <Typography variant="headline" component="h3">
                This is a sheet of paper.
              </Typography>
              <Typography component="p">
              Lorem ipsum. At vero eos et accusam et justo duo dolores et ea rebum.              </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}


export default withStyles(styles)(IndexPage)