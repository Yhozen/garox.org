import { FC } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

const url = `/api/hello`

const fetcher = (url: string) => fetch(url).then(response => response.json())

const SpotifyContainer = styled.div`
  background: white;
  padding: 2rem;
`

const Example = {
  cover: 'https://i.scdn.co/image/ab67616d00004851171f7a0b1f8076e6d9aaf6b7',
  artist: 'Stone Temple Pilots',
  track: 'Plush',
  isPlaying: true,
  progress: 162707,
  duration: 310346,
}

type SpotifyData = {
  cover: string
  artist: string
  track: string
  isPlaying: boolean
  progress: number
  duration: number
}

const WhilePlaying: FC<{ data: SpotifyData }> = ({ data }) => {
  return (
    <div>
      <img src={data.cover} />
      <br />
      <progress max={data.duration} value={data.progress} />
      <p>{data.track}</p>
      <p>{data.artist}</p>
    </div>
  )
}

export const Spotify = () => {
  const { data, error, mutate } = useSWR<SpotifyData>(url, fetcher)

  const isLoading = !data && !error

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>error loading</p>

  return (
    <SpotifyContainer>
      {data && data.isPlaying && <WhilePlaying data={data} />}
      {!data?.isPlaying && <p>not playig spotify, ears resting</p>}
      <button onClick={() => mutate()}> refresh</button>
    </SpotifyContainer>
  )
}
