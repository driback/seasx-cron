export type AfreecaTVLive = { data: Live[]; pool_check: string };

type Live = {
  favorite_no: number;
  user_id: string;
  user_nick: string;
  is_alimi: Is;
  is_mobile_push: Is;
  is_favorite: boolean;
  is_pin: boolean;
  is_live: boolean;
  is_fanclub: boolean;
  is_subscribe: boolean;
  station_name: string;
  total_view_cnt: number;
  last_broad_start: string;
  broad_info: BroadInfo[];
};

type BroadInfo = {
  user_id: string;
  user_nick: string;
  broad_no: number;
  parent_broad_no: number;
  broad_start: string;
  broad_cate_no: string;
  broad_bps: number;
  broad_resolution: BroadResolution;
  broad_img: string;
  broad_title: string;
  total_view_cnt: number;
  pc_view_cnt: number;
  mobile_view_cnt: number;
  broad_type: string;
  is_visit_broad: boolean;
  is_1080p: boolean;
  is_fanclub: boolean;
  is_subscribe: boolean;
  is_adult: boolean;
  is_password: boolean;
  is_drops: boolean;
  url: string;
  hash_tags: string[];
  category_tags: string[];
  auto_hashtags: string[];
};

type BroadResolution = "1920x1080" | "1280x720" | "1080x1920" | "720x1280" | "1024x576";

type Is = "Y" | "N";
