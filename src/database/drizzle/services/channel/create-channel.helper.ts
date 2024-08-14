import { eq } from "drizzle-orm";
import { stringify } from "superjson";
import { afreecaTvApiServices } from "~/afreecatv/afreecatv-api-service";
import type { AfreecaTVStationsLinks, Link } from "~/afreecatv/types/stations-links";
import { uploadImage } from "~/libs/image-kit";
import { buildThumbnailSources } from "~/libs/utils";
import { db } from "../../client";
import { channel, channelBanner, socialLinks } from "../../schema";

export const fetchChannelData = async (channelId: string) => {
  return await db.query.channel.findFirst({
    where: (ch, { eq }) => eq(ch.channelId, channelId),
  });
};

export const fetchPlatformData = async (platformName: string) => {
  return await db.query.platform.findFirst({
    where: (pl, { eq }) => eq(pl.name, platformName),
  });
};

export const fetchAfreecaChannelData = async (channelId: string) => {
  const stationData = await afreecaTvApiServices.station(channelId);

  if (stationData.error) {
    const bjData = await afreecaTvApiServices.bj(channelId);
    if (bjData.RESULT !== 1) {
      return null;
    }

    return {
      channelId: bjData.DATA.user_id,
      channelName: bjData.DATA.user_nick,
      platformApiResponses: stringify(bjData.DATA),
      platformLink: `https://bj.afreecatv.com/${bjData.DATA.user_id}`,
    };
  }

  return {
    channelId: stationData.data?.station.user_id ?? "",
    channelName: stationData.data?.station.user_nick ?? "",
    platformApiResponses: stringify(stationData),
    platformLink: `https://bj.afreecatv.com/${stationData.data?.station.user_nick}`,
  };
};

export const insertNewChannel = async (datas: Omit<typeof channel.$inferInsert, "logo">) => {
  const [createChannel] = await db
    .insert(channel)
    .values({
      ...datas,
      logo: { big: "", large: "", medium: "", small: "", original: "" },
    })
    .returning({ id: channel.id, channelId: channel.channelId });

  return createChannel;
};

export const insertNewChannelBanner = async (props: typeof channelBanner.$inferInsert) => {
  const [createChannelBanner] = await db.insert(channelBanner).values(props).returning();
  return createChannelBanner;
};

export const insertNewSocialLinks = async (links: Link[], channelId: string) => {
  const datas = links.map((d) => {
    return {
      name: d.link_name,
      link: d.url,
      platform: d.code,
      channelId,
    };
  }) as (typeof socialLinks.$inferInsert)[];

  console.log("create: create channel sns");
  const [createSocialLinks] = await db.insert(socialLinks).values(datas).returning();
  return createSocialLinks;
};

export const addChannelBannerAndSocialLinks = async (
  afreecatvStationLinks: AfreecaTVStationsLinks,
  channelId: string,
) => {
  console.log("create: create channel banner");
  await insertNewChannelBanner({
    source: `https:${afreecatvStationLinks.channelart.pc_url}`,
    position: [0, 0],
    channelId,
  });

  if (!afreecatvStationLinks.links.length) return;

  console.log("create: create channel sns");
  await insertNewSocialLinks(afreecatvStationLinks.links, channelId);
};

export const createChannelLogo = async (id: string, channelId: string) => {
  console.log("upload: upload channel logo");
  const uploadChannelLogo = await uploadImage({
    file: `https://profile.img.afreecatv.com/LOGO/${channelId.slice(0, 2)}/${channelId}/${channelId}.jpg`,
    fileName: `${channelId}.jpg`,
    folder: `afreecatv/${channelId}/avatar/`,
  });

  console.log("build: build channel thumbnail");
  const thumb = buildThumbnailSources(uploadChannelLogo.url, "channel");

  console.log("create: create channel thumbnail");
  await db
    .update(channel)
    .set({ logo: { ...thumb } })
    .where(eq(channel.id, id));
};
