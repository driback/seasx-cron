import { afreecaTvApiServices } from "~/afreecatv/afreecatv-api-service";

export const getAfreecaTvVideo = async (videoId: string, platformCookies: string) => {
  const vod = await afreecaTvApiServices.vod(videoId, platformCookies);
  if (!vod || vod.result !== 1) return null;

  const { data } = vod;
  if (data.flag !== "SUCCEED" || !data.files.length) return null;
  return data;
};
