import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { StyledComponentProps, withStyles } from '@material-ui/core/styles'
import { motion } from 'framer-motion'
import Head from 'next/head'
import styled from 'styled-components'

import Me from '../components/Me'
import { Window } from '../components/window'

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
  min-width: 99vw;
  min-height: 99vh;

  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  background: repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% /
    0.25rem 0.25rem;
`

const Home = ({ classes }: StyledComponentProps) => {
  return (
    <>
      <Head>
        <title>Portfolio</title>
      </Head>
      <Chess>
        <Grid item xs={12}>
          <motion.div drag dragMomentum={false}>
            <Me classes={classes} />
          </motion.div>
        </Grid>
        <Grid item xs={12} style={{ padding: 20 }}>
          <Grid container spacing={24} justify="center">
            {[0, 1, 2].map(value => (
              <motion.div key={value} drag dragMomentum={false}>
                <Grid item sm={4}>
                  <Paper className={classes?.paper} elevation={2}>
                    <h3>This is Nicht a sheet of paper.</h3>
                    <p>
                      Lorem ipsum. At vero eos et accusam et justo duo dolores
                      et ea rebum.
                    </p>
                  </Paper>
                </Grid>
              </motion.div>
            ))}
            <Window />
          </Grid>
        </Grid>
      </Chess>
    </>
  )
}

export default withStyles(materialStyles as any)(Home)
