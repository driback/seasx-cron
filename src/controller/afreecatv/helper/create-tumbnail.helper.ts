import { updateVideoByVideoId } from "~/database/drizzle/repository/video.repository";
import { uploadImage } from "~/libs/image-kit";
import { buildThumbnailSources } from "~/libs/utils";

type CreateThumbnailBgProps = {
  thumbnailUrl: string;
  videoId: string;
  channelId: string;
  platform: string;
};

export const createThumbnailBg = async (props: CreateThumbnailBgProps) => {
  const { thumbnailUrl, videoId, channelId, platform } = props;

  console.log("add: upload vod thumbnail");
  const uploadVodThumbnail = await uploadImage({
    file: thumbnailUrl,
    fileName: `${videoId}.jpg`,
    folder: `${platform}/${channelId}/vod/`,
  });

  console.log("add: build vod thumbnail");
  const thumb = buildThumbnailSources(uploadVodThumbnail.url, "vod");

  console.log("add: create vod thumbnail");
  const createThumb = await updateVideoByVideoId(videoId, { thumbnail: thumb });

  console.log("Thumbnail done");

  return createThumb;
};
