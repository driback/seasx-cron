export type AfreecaTVStation = {
  profile_image: string;
  station: Station;
  broad: Broad;
  starballoon_top: Top[];
  sticker_top: Top[];
  subscription: Subscription;
  is_best_bj: boolean;
  is_partner_bj: boolean;
  is_sports_bj: boolean;
  is_ppv_bj: boolean;
  is_af_supporters_bj: boolean;
  is_shopfreeca_bj: boolean;
  is_favorite: boolean;
  is_subscription: boolean;
  is_owner: boolean;
  is_manager: boolean;
  is_notice: boolean;
  is_adsence: boolean;
  is_mobile_push: boolean;
  subscribe_visible: string;
  country: string;
  current_timestamp: Date;
};

type Broad = {
  user_id: string;
  broad_no: number;
  broad_title: string;
  current_sum_viewer: number;
  broad_grade: number;
  is_password: boolean;
};

type Top = {
  user_id: string;
  user_nick: string;
  profile_image: string;
};

type Station = {
  display: Display;
  groups: Group[];
  menus: Menu[];
  upd: Upd;
  vods: Menu[];
  sns: Sn[];
  broad_start: Date;
  grade: number;
  jointime: Date;
  station_name: string;
  station_no: number;
  station_title: string;
  total_broad_time: number;
  user_id: string;
  user_nick: string;
  active_no: number;
};

type Display = {
  main_type: string;
  title_type: string;
  title_text: string;
  profile_text: string;
  skin_type: number;
  skin_no: number;
  title_skin_image: string;
};

type Group = {
  idx: number;
  group_no: number;
  priority: number;
  info: Info;
};

type Info = {
  group_name: string;
  group_class_name: string;
  group_background_color: string;
};

type Menu = {
  bbs_no: number;
  station_no: number;
  auth_no: number;
  w_auth_no: number;
  display_type: number;
  rnum: number;
  line: number;
  indention: number;
  name: string;
  name_font: number;
  main_view_yn: number;
  view_type: number;
};

type Sn = {
  id: number;
  user_id: string;
  type: number;
  channel_id: string;
  playlist_id: string;
  title: string;
  followers: number;
  state: number;
  expire_at: Date;
  created_at: Date;
  updated_at: Date;
};

type Upd = {
  station_no: number;
  user_id: string;
  asp_code: number;
  fan_cnt: number;
  today0_visit_cnt: number;
  today1_visit_cnt: number;
  total_visit_cnt: number;
  today0_ok_cnt: number;
  today1_ok_cnt: number;
  today0_fav_cnt: number;
  today1_fav_cnt: number;
  total_ok_cnt: number;
  total_view_cnt: number;
};

type Subscription = {
  count: number;
};
