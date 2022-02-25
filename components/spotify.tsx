import styled from 'styled-components'
import useSWR from 'swr'

const url = `/api/hello`

const fetcher = (url: string) => fetch(url).then(response => response.json())

const SpotifyContainer = styled.div`
  background: white;
  padding: 2rem;
`

export const Spotify = () => {
  const { data, error, mutate } = useSWR(url, fetcher)

  const isLoading = !data && !error

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>error loading</p>

  return (
    <SpotifyContainer>
      <p>{JSON.stringify(data, null, 4)}</p>
      <button onClick={() => mutate()}> refresh</button>
    </SpotifyContainer>
  )
}
