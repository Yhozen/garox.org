import styled from 'styled-components'
import { IconProps } from '../types/IconProps'

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  width: 4rem;
  cursor: pointer;
`

export const Icon = ({ id }: IconProps) => {
  return (
    <IconContainer>
      <code>{id}</code>
    </IconContainer>
  )
}
