import React from 'react'
import Link from 'gatsby-link'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

const IndexPage = (props) => {
  const { classes } = props

  return (
    <div>
      <Grid container justify="center" direction='column' >
        <Grid item xs={12}>
          <Grid container spacing={24} justify="center">
            {[0, 1, 2].map(value => (
              <Grid key={value} item xs={4}>
                <Paper className={classes.paper} elevation={2}>
                <Typography variant="headline" component="h3">
                  This is a sheet of paper.
                </Typography>
                <Typography component="p">
                  Paper can be used to build surface or other elements for your application.
                </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}


export default withStyles(styles)(IndexPage)