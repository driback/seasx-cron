import { waitUntil } from "@vercel/functions";
import { afreecaTvApiServices } from "~/afreecatv/afreecatv-api-service";
import { createErrorResponse, createSuccessResponse } from "../utils";
import {
  addChannelBannerAndSocialLinks,
  createChannelLogo,
  fetchAfreecaChannelData,
  fetchChannelData,
  fetchPlatformData,
  insertNewChannel,
} from "./create-channel.helper";

type CreateChannelProps = {
  channelId: string;
};

export const createChannel = async ({ channelId }: CreateChannelProps) => {
  try {
    const hasChannel = await fetchChannelData(channelId);

    if (hasChannel) {
      return createSuccessResponse("Channel is exist");
    }

    const findPlatform = await fetchPlatformData("afreecatv");

    if (!findPlatform) {
      return createErrorResponse("Platform not found");
    }

    const afreecatvStation = await fetchAfreecaChannelData(channelId);

    if (!afreecatvStation) {
      return createErrorResponse("Something went wrong");
    }

    const newChannel = await insertNewChannel({ ...afreecatvStation, platformId: findPlatform.id });

    if (!newChannel) {
      return createErrorResponse("Failed to create channel");
    }

    const afreecatvStationLinks = await afreecaTvApiServices.stationLinks(channelId);

    if (!!afreecatvStationLinks) {
      await addChannelBannerAndSocialLinks(afreecatvStationLinks, newChannel.id);
    }

    waitUntil(createChannelLogo(newChannel.id, newChannel.channelId));

    return createSuccessResponse(newChannel);
  } catch (error) {
    console.log("🚀 ~ createChannel ~ error:", error);

    if (error instanceof Error) {
      return createErrorResponse(error.message);
    }
    return createErrorResponse("Internal server error");
  }
};
