import axios from "axios";

import type { AfreecaTVAres } from "./types/ares";
import type { AfreecaTVAresX, AresxInput } from "./types/aresx";
import type { AfreecaTVBj } from "./types/bj";
import type { AfreecaTVClipCatch, ClipCatchInput } from "./types/cilp-catch";
import type { AfreecaTVReplay } from "./types/replay";
import type { AfreecaTVSearchVideo } from "./types/search-video";
import type { AfreecaTVStation } from "./types/station";
import type { AfreecaTVStationsLinks } from "./types/stations-links";
import type { AfreecaTVStationsVods } from "./types/stations-vods";
import type { AfreecaTVVod } from "./types/vod";

export class AfreecaTvApiServices {
  private getRequest = async <T>(path: string, cookies?: string) => {
    const options = {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
        Cookie: cookies ?? "",
      },
    };
    return await axios.get<T>(path, options);
  };

  private postRequest = async <T>(path: string, data: unknown, cookies?: string) => {
    const headersList = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
      Cookie: cookies ?? "",
    };

    const options = {
      headers: headersList,
    };

    return await axios.post<T>(path, data, options);
  };

  signin(username: string, password: string) {
    const params = new URLSearchParams({
      szWork: "login",
      szType: "json",
      szUid: username,
      szPassword: password,
      isSaveId: "false",
      szScriptVar: "oLoginRet",
      szAction: "",
    });

    return this.postRequest("https://login.afreecatv.com/app/LoginAction.php", params);
  }

  async bj(stationId: string) {
    const params = new URLSearchParams({
      szBjId: stationId,
    });

    const res = await this.postRequest<AfreecaTVBj | null>(
      "https://st.afreecatv.com/api/get_station_status.php",
      params,
    );

    if (res.status !== 200) return null;

    return res.data;
  }

  async station(stationId: string) {
    const res = await this.getRequest<AfreecaTVStation | null>(
      `https://bjapi.afreecatv.com/api/${stationId}/station`,
    );

    if (res.status !== 200) return null;

    return res.data;
  }

  async stationLinks(stationId: string) {
    const res = await this.getRequest<AfreecaTVStationsLinks>(
      `https://bjapi.afreecatv.com/api/${stationId}/station/bj`,
    );

    if (res.data.code) return null;

    return res.data;
  }

  async stationVods(
    stationId: string,
    slug: "all" | "review" | "normal" | "user" | "clip" | "catch" | "fan",
    props: StationVodsProps,
  ) {
    const params = new URLSearchParams({
      page: String(props.page),
      per_page: String(props.offset),
      orderby: props.orderBy,
      field: "title,contents",
      created: "false",
      catchCreated: "true",
      months: props.months,
    });

    const res = await this.getRequest<AfreecaTVStationsVods | null>(
      `https://bjapi.afreecatv.com/api/${stationId}/vods/${slug}?${params.toString()}`,
    );

    if (res.status !== 200) return null;

    return res.data;
  }

  async vod(vodId: string, cookies?: string) {
    try {
      const params = new URLSearchParams({
        nTitleNo: vodId,
        nApiLevel: "10",
        nPlaylistIdx: "0",
      });

      const res = await this.postRequest<AfreecaTVVod | null>(
        "https://api.m.afreecatv.com/station/video/a/view",
        params,
        cookies,
      );

      if (res.status !== 200) return null;

      return res.data;
    } catch (error) {
      console.log("🚀 ~ AfreecaTvApiServices ~ vod ~ error:", error);
      return null;
    }
  }

  async replay(cookies: string) {
    const res = await this.getRequest<AfreecaTVReplay | null>(
      `https://myapi.afreecatv.com/api/favorite/vod`,
      cookies,
    );

    if (res.status !== 200) return null;

    return res.data;
  }

  async clipCatch(cookies: string, props: ClipCatchInput) {
    const params = new URLSearchParams({
      szDataType: "FAVORITE",
      szDataDetailType: props.type,
      nPage: String(props.page),
      nLimit: String(props.offset),
      szOrder: props.sort,
    });

    const res = await this.postRequest<AfreecaTVClipCatch | null>(
      "https://stbbs.afreecatv.com/api/get_vod_list.php",
      params,
      cookies,
    );

    if (res.status !== 200) return null;

    return res.data;
  }

  async ares(cookies: string, props: AresProps) {
    const params = new URLSearchParams({
      szMenuId: "adult",
      szKeyword: "",
      nPage: String(props.page),
      nLimit: String(props.offset),
    });

    const res = await this.postRequest<AfreecaTVAres | null>(
      "https://stbbs.afreecatv.com/api/vod_list_controller.php",
      params,
      cookies,
    );

    if (res.status !== 200) return null;

    return res.data;
  }

  async aresx(cookies: string, props: AresxInput) {
    const params = new URLSearchParams({
      m: "vodList",
      nPageNo: `${props.page}`,
      nListCnt: `${props.offset}`,
      szOrder: props.sort,
      szTerm: props.date,
      szPlatform: "pc",
      v: "3.0",
      szCateNo: "00030000",
    });

    const res = await this.getRequest<AfreecaTVAresX | null>(
      `https://sch.afreecatv.com/api.php?${params.toString()}`,
      cookies,
    );

    if (res.status !== 200) return null;

    return res.data;
  }

  async searchVideo(props: SearchVideoInput) {
    const params = new URLSearchParams({
      v: "5.0",
      m: "vodSearch",
      w: "webm",
      isMobile: "0",
      align_type: "list",
      szKeyword: props.query,
      szOrder: props.sort,
      szFileType: props.type,
      nListCnt: `${props.offset}`,
      nPageNo: `${props.page}`,
      szTerm: `${props.time}`,
      szTabType: "VOD",
      location: "total_search",
      tab: "vod",
    });

    const res = await this.postRequest<AfreecaTVSearchVideo | null>(
      "https://sch.afreecatv.com/api.php",
      params,
    );

    if (res.status !== 200) return null;

    return res.data;
  }
}

type SearchVideoInput = {
  query: string;
  sort: "accur" | "view_cnt" | "reg_datetime";
  page: number;
  offset: number;
  time: "1day" | "1week" | "1month" | "1year" | "all";
  type: "ALL" | "REVIEW" | "CLIP" | "CATCH" | "PLAYLIST" | "NORMAL" | "HIGHLIGHT";
};

type StationVodsProps = {
  page: number;
  offset: number;
  months: string;
  orderBy:
    | "reg_date"
    | "reg_date_asc"
    | "read_cnt"
    | "comment_cnt"
    | "like_cnt"
    | "live_pv"
    | "popular";
};

type ClipClatchProps = {
  type: "fav_catch" | "fav_clip";
  page: number;
  offset: number;
  order: string;
};

type AresProps = Omit<ClipClatchProps, "type" | "order">;

export const afreecaTvApiServices = new AfreecaTvApiServices();
