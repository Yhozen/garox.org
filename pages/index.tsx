import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {  StyledComponentProps, withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Me from '../components/Me'

const materialStyles = (theme: any) => ({
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

const Home  = ({ classes }: StyledComponentProps) =>{
  return (
    <div className={styles.container}>
      <Head>
        <title>Portfolio</title>
        <meta name="description" content="Garox's portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid container justify='center' alignItems='center' direction='column' style={{ padding: 20 }}>
      <Grid item xs={12}>
        <Me classes={classes}/>
      </Grid>
      <Grid item xs={12} style={{ padding: 20 }}>
        <Grid container spacing={24} justify="center">
          {[0, 1, 2].map(value => (
            <Grid key={value} item sm={4}>
              <Paper className={classes?.paper} elevation={2}>
              <Typography variant="headline" component="h3">
                This is a sheet of paper.
              </Typography>
              <Typography component="p">
                Lorem ipsum. At vero eos et accusam et justo duo dolores et ea rebum.              
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

export default withStyles(materialStyles as any)(Home)