import { waitUntil } from "@vercel/functions";
import { stringify } from "superjson";
import { afreecaTvApiServices } from "~/afreecatv/afreecatv-api-service";
import { db } from "~/database/drizzle/client";
import {
  findChannelByChannelId,
  insertChannel,
  insertChannelBanner,
  insertSocialLinks,
} from "~/database/drizzle/repository/channel.repository";
import { findPlatformByName } from "~/database/drizzle/repository/platform.repository";
import type { socialLinks } from "~/database/drizzle/schema";
import { createChannelLogo } from "./create-channel-logo.helper";

export const createafreecaTvChannel = async (channelId: string) => {
  let datas;

  try {
    const channel = await findChannelByChannelId(channelId);

    if (channel) {
      throw new Error("Channel is exist");
    }

    const platform = await findPlatformByName("afreecatv");

    if (!platform) {
      throw new Error("Platform not found");
    }

    const afreecatvStation = await afreecaTvApiServices.station(channelId);

    if (!afreecatvStation) {
      const bj = await afreecaTvApiServices.bj(channelId);

      if (bj?.RESULT !== 1) {
        throw new Error("Failed to create channel");
      }

      datas = {
        channelId: bj.DATA.user_id,
        channelName: bj.DATA.user_nick,
        platformApiResponses: stringify(bj.DATA),
        platformLink: `https://bj.afreecatv.com/${bj.DATA.user_id}`,
      };
    }

    const cdatas = { ...datas };

    datas = {
      channelId: afreecatvStation?.station.user_id ?? cdatas.channelId ?? "",
      channelName: afreecatvStation?.station.user_nick ?? cdatas.channelName ?? "",
      platformApiResponses: stringify(afreecatvStation),
      platformLink: `https://bj.afreecatv.com/${afreecatvStation?.station.user_nick}`,
    };

    const createChannel = await insertChannel([
      {
        ...datas,
        logo: { big: "", large: "", medium: "", small: "", original: "" },
        platformId: platform.id,
      },
    ]);

    if (!createChannel) {
      throw new Error("Failed to create channel");
    }

    const afreecatvStationLinks = await afreecaTvApiServices.stationLinks(channelId);

    if (!!afreecatvStationLinks) {
      await db.transaction(
        async (tx) => {
          console.log("create: create channel banner");

          const insChannelBanner = await insertChannelBanner([
            {
              source: `https:${afreecatvStationLinks.channelart.pc_url}`,
              position: [0, 0],
              channelId: createChannel.id,
            },
          ]);

          if (!insChannelBanner) return tx.rollback();

          if (!afreecatvStationLinks.links.length) return;

          const datas = afreecatvStationLinks.links.map((d) => {
            return {
              name: d.link_name,
              link: d.url,
              platform: d.code,
              channelId: createChannel.id,
            };
          }) as (typeof socialLinks.$inferInsert)[];

          console.log("create: create channel sns");
          await insertSocialLinks(datas);
        },
        {
          isolationLevel: "read committed",
          accessMode: "read write",
          deferrable: true,
        },
      );
    }

    waitUntil(
      createChannelLogo({
        id: createChannel.id,
        channelId: createChannel.channelId,
        platform: "afreecatv",
        file: `https://profile.img.afreecatv.com/LOGO/${createChannel.channelId.slice(0, 2)}/${createChannel.channelId}/${createChannel.channelId}.jpg`,
      }),
    );

    return;
  } catch (error) {
    console.log("🚀 ~ .mutation ~ error:", error);
    throw error;
  }
};
