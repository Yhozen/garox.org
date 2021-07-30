import Head from 'next/head'
import { StyledComponentProps, withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Me from '../components/Me'
import styled from 'styled-components'

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
  },
})

const Chess = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  width: 100%;
  height: 100%;
  background: repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% /
    4px 4px;
`

const Home = ({ classes }: StyledComponentProps) => {
  return (
    <>
      <Head>
        <title>Portfolio</title>
        <meta name="description" content="Garox's portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Chess>
        <Grid
          container
          justify="center"
          alignItems="center"
          direction="column"
          style={{ padding: 20 }}
        >
          <Grid item xs={12}>
            <Me classes={classes} />
          </Grid>
          <Grid item xs={12} style={{ padding: 20 }}>
            <Grid container spacing={24} justify="center">
              {[0, 1, 2].map((value) => (
                <Grid key={value} item sm={4}>
                  <Paper className={classes?.paper} elevation={2}>
                    <Typography variant="headline" component="h3">
                      This is not a sheet of paper.
                    </Typography>
                    <Typography component="p">
                      Lorem ipsum. At vero eos et accusam et justo duo dolores
                      et ea rebum.
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Chess>
    </>
  )
}

export default withStyles(materialStyles as any)(Home)
