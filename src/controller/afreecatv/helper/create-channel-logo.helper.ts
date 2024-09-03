import { eq } from "drizzle-orm";
import { db } from "~/database/drizzle/client";
import { channel } from "~/database/drizzle/schema";
import { uploadImage } from "~/libs/image-kit";
import { buildThumbnailSources } from "~/libs/utils";

type CreateChannelLogoProps = {
  id: string;
  channelId: string;
  platform: string;
  file: string;
};

export const createChannelLogo = async (props: CreateChannelLogoProps) => {
  console.log("upload: upload channel logo");
  const uploadChannelLogo = await uploadImage({
    file: props.file,
    fileName: `${props.channelId}.jpg`,
    folder: `${props.platform}/${props.channelId}/avatar/`,
  });

  console.log("build: build channel thumbnail");
  const thumb = buildThumbnailSources(uploadChannelLogo.url, "channel");

  console.log("create: create channel thumbnail");
  await db
    .update(channel)
    .set({ logo: { ...thumb } })
    .where(eq(channel.id, props.id));
};
