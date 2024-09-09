import { createafreecaTvChannel } from "./create-afreecatv-channel.helper";
import { createAfreecaTvVideo } from "./create-afreecatv-video.helper";

export const addAfreecaTvVideo = async (props: Parameters<typeof createAfreecaTvVideo>[0]) => {
  try {
    const nvideo = await createAfreecaTvVideo(props);

    if (!(nvideo.success || nvideo.data)) {
      return { success: false, message: "Failed to add vod" };
    }

    let MAX_RETRIES = 3;

    while (!nvideo.success && nvideo.data && MAX_RETRIES > 0) {
      await createafreecaTvChannel(nvideo.data.channelId!);
      const add = await createAfreecaTvVideo(props);

      if (add.success) break;

      MAX_RETRIES -= 1;
    }

    if (!(MAX_RETRIES || nvideo.success)) {
      return { success: false, message: "Failed to add vod" };
    }

    return {
      success: true,
      message: `Vod with id ${props.title_no} succesfully add to db`,
    };
  } catch (error) {
    console.log("🚀 ~ addVideo ~ error:", error);
    return { success: false, message: "Failed to add vod" };
  }
};
