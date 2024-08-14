export type AfreecaTVSearchVideo = {
  RESULT: number;
  TOTAL_CNT: number;
  HAS_MORE_LIST: boolean;
  FILETYPE_CNT: null;
  processTm: number;
  t: string;
  charset: string;
  DATA: Datum[];
  RELATED_DATA: RelatedData;
  LATEST_DATA: unknown[];
  RECOMMEND_DATA: unknown[];
  CATCH_DATA: unknown[];
  WORD: string;
  origin_word: string;
  sessionKey: string;
};

type Datum = {
  title_no: string;
  view_cnt: string;
  original_bj?: string;
  auth: Auth;
  vod_category_name: string;
  title: string;
  station_no: string;
  content: Content;
  file_resolution: FileResolution;
  vod_category: string;
  thumbnail_path: string;
  category_id: string;
  file_type: Type;
  bbs_no: string;
  org_title_no?: string;
  memo_cnt: string;
  mobile_thumbnail_path: string;
  station_name: string;
  recomm_cnt: string;
  original_user_nick?: string;
  user_nick: string;
  hotclip_yn: string;
  encoding_type: string;
  video_type: VideoType;
  reg_date: Date;
  user_id: string;
  grade: string;
  ucc_type: string;
  broad_no?: string;
  original_type?: Type;
  vertical_thumbnail_path: null | string;
  category: string;
  status: string;
  time: Date;
  url: string;
  duration: string;
  vod_duration: string;
  hash_tags: string[];
  b_title: string;
  aftv_score: string;
  ppv: boolean;
  rookie: boolean;
  fan_flag: number;
  subs_flag: number;
  type: Type;
  timestamp: number;
  webp_path: string;
  vertical_webp_path: string;
  broad_date: string;
  category_tags: string[];
  auto_hashtags: unknown[];
  title_history: unknown[];
  use_vertical_thumbnail: boolean;
};

type Auth = "OPEN_ALL";

type Content = "" | "  ";

type FileResolution = "640x1080" | "1280x720" | "1920x1080";

type Type = "CATCH" | "CLIP" | "REVIEW";

type VideoType = "ucc";

type RelatedData = {
  VOD: unknown[];
  BJ: unknown[];
};
