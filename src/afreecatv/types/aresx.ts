export type AfreecaTVAresX = {
  RESULT: number;
  TOTAL_CNT: number;
  DATA: Datum[];
};

type Datum = {
  title_no: string;
  view_cnt: string;
  original_bj?: string;
  auth: Auth;
  vod_category_name: VODCategoryName;
  title: string;
  station_no: string;
  content: Content;
  file_resolution: string;
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
  original_type?: OriginalType;
  vertical_thumbnail_path: null | string;
  category: string;
  status: string;
  time: Date;
  url: string;
  duration: string;
  vod_duration: string;
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
  hash_tags: string[];
  auto_hashtags: string[];
  title_history: TitleHistory[];
  use_vertical_thumbnail: boolean;
};

type Auth = "OPEN_ALL";

type Content = "  " | "";

type Type = "CATCH" | "CLIP" | "REVIEW" | "NORMAL";

type OriginalType = "CATCH" | "CLIP" | "USER";

type TitleHistory = {
  view_cnt: number;
  change_tm: number;
  change_position: string;
  title: string;
  change_second: number;
};

type VideoType = "ucc";

type VODCategoryName = "토크/캠방" | "낚시" | "스타크래프트" | "서든어택" | "먹방/쿡방";

export type AresxInput = {
  sort: "reg_date" | "popular" | "recomm_cnt" | "view_cnt" | "memo_cnt";
  date: "all" | "1day" | "1week" | "1month" | "1year";
  page: number;
  offset: number;
};
