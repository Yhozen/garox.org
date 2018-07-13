import React from 'react'
import Link from 'gatsby-link'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
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
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
});

const Me = (props) => {
  const { classes } = props
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="Contemplative Reptile"
      />
      <CardContent>
        <Typography gutterBottom variant="headline" component="h2">
          Lizard
        </Typography>
        <Typography component="p">
          Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
          across all continents except Antarctica
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
                Paper can be used to build surface or other elements for your application.
              </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}


export default withStyles(styles)(IndexPage)