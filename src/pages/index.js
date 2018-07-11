import React from 'react'
import Link from 'gatsby-link'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const IndexPage = () => (
  <div>
      <Button variant="contained" color="primary">
      Hello World
    </Button>
    <Grid container spacing={16}>
      <Grid item xs={12}>
        <Grid container justify="center">
          {[0, 1, 2].map(value => (
            <Grid key={value} item>
              <Paper elevation={1}>
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

export default IndexPage
