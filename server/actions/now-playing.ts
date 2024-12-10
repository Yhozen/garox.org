"use server";

import { z } from "zod";

const url = `${process.env.API_URL}/api/now-playing-plain`;

const responseSchema = z.object({
  name: z.string(),
});

export const getNowPlaying = async () => {
  const response = await fetch(url);
  const data = await response.json();

  return responseSchema.parse(data);
};
