// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'isomorphic-fetch'

const url = `${process.env.API_URL}/api/now-playing-plain`

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const response = await fetch(url)
  const data = await response.json()
  res.status(200).json(data)
}
