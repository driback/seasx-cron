import type { AfreecaTvApiResponse } from "./response";

export type AfreecaTVClipCatch = AfreecaTvApiResponse<ClipCatch>;

type ClipCatch = {
  total_cnt: number;
  more_yn: string;
  bj_cnt: number;
  list: List[];
  list_cnt: number;
};

type List = {
  title_no: string;
  auth_no: string;
  station_no: string;
  bbs_no: string;
  title_name: string;
  thumb: string;
  resolution_type: ResolutionType;
  vertical_thumb: string;
  file_type: FileType;
  read_cnt: string;
  like_cnt: string;
  comment_cnt: string;
  reg_date: Date;
  reg_timestamp: number;
  duration: string;
  user_nick: string;
  user_id: string;
  user_profile_img: string;
  ucc_type: string;
  category: string;
  vod_category: string;
  grade: string;
  last_view_duration: number;
  total_duration: number;
  thumb_move: string;
  is_subscribe: boolean;
  is_fanclub: boolean;
  scheme: string;
  is_ppv: boolean;
  webp_path: string;
  vertical_webp_path: string;
  hash_tags: string[];
  category_tags: CategoryTag[];
  original_user_nick: string;
  original_user_id: string;
};

type CategoryTag = "보라" | "토크" | "RTS" | "전략" | "음악";

type FileType = "CATCH" | "CLIP";

type ResolutionType = "horizontal" | "vertical";

export type ClipCatchInput = {
  type: "fav_catch" | "fav_clip";
  sort: "reg_date" | "popular" | "recomm_cnt" | "view_cnt" | "memo_cnt";
  page: number;
  offset: number;
};
