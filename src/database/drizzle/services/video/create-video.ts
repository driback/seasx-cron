import { waitUntil } from "@vercel/functions";
import { createErrorResponse, createSuccessResponse } from "../utils";
import {
  addVodToDatabase,
  createThumbnailBg,
  fetchChannelData,
  fetchPlatformData,
  fetchVodData,
} from "./create-video.helper";

type AddVideoProps = {
  videoId: number;
};

export const createVideo = async ({ videoId }: AddVideoProps) => {
  try {
    console.log("Fetch platform data");
    const platformData = await fetchPlatformData("afreecatv");
    if (!platformData?.cookies) return createErrorResponse("Cookies not found");

    console.log("Fetch vod data");
    const vodData = await fetchVodData(videoId, platformData.cookies);
    if (!vodData) return createErrorResponse("Vod not found");

    console.log("Fetch channel data");
    const channelData = await fetchChannelData(vodData.bj_id);
    if (!channelData) return createSuccessResponse(vodData.bj_id);

    console.log("addVodToDatabase");
    const addVodResponse = await addVodToDatabase(vodData, platformData.id, channelData.id);
    if (!addVodResponse.success) return addVodResponse;

    console.log("createThumbnailBg");
    waitUntil(
      createThumbnailBg({
        thumbnailUrl: vodData.thumb,
        videoId: vodData.title_no,
        channelId: vodData.bj_id,
      }),
    );

    console.log("Done.", videoId);
    return createSuccessResponse(addVodResponse.data);
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : "Internal server error");
  }
};
