import styled from 'styled-components'

const Paper = styled.div`
  width: 10rem;
  background: white;
  padding: 0.4rem;
  border-radius: 0.3rem;
`
export const Sheet = () => {
  return (
    <Paper>
      <h3>This is Nicht ae sheet of paper.</h3>
      <p>
        Lorem ipsum. At vero eos et accusam et justo duo dolores et ea rebum.
      </p>
    </Paper>
  )
}
