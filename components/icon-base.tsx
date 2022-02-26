import { FC } from 'react'
import styled from 'styled-components'
import { IconProps } from '../types/IconProps'

const AppContainer = styled.div`
  padding: 0.2rem;
  margin: 1rem;
  height: 4rem;
  width: 4rem;
  cursor: pointer;
  text-align: center;
`

const IconContainer = styled.div`
  height: 50px;
  width: 50px;
  margin: 0 auto;
  filter: drop-shadow(1px 1px 3px #0e0e11);
`

const Code = styled.code`
  filter: drop-shadow(2px 1px 4px #eee);
`

export const Icon: FC<IconProps> = ({ id, children }) => {
  return (
    <AppContainer>
      <IconContainer>{children}</IconContainer>
      <Code>{id}</Code>
    </AppContainer>
  )
}
