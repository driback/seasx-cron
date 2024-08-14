export type AfreecaTVStationsVods = {
  data: Datum[];
  links: Links;
  meta: Meta;
};

type Datum = {
  title_no: number;
  station_no: number;
  bbs_no: number;
  board_type: number;
  auth_no: number;
  title_name: string;
  user_nick: UserNick;
  user_id: UserID;
  profile_image: ProfileImage;
  photo_cnt: number;
  platform_type: number;
  notice_yn: number;
  comment_yn: number;
  reply_yn: number;
  livepost_yn: number;
  share_yn: number;
  search_yn: number;
  ip: string;
  reg_date: Date;
  ucc: Ucc;
  display: Display;
  count: Count;
  pin: null;
  copyright: null;
  reserve: null;
  badge: null;
  authority: Record<string, boolean>;
};

type Count = {
  like_cnt: number;
  read_cnt: number;
  comment_cnt: number;
  ucc_favorite_cnt: number;
};

type Display = {
  bbs_name: BBSName;
};

type BBSName = string;

type ProfileImage = string;

type Ucc = {
  thumb: null | string;
  thumb_type: Flag;
  flag: Flag;
  ucc_type: string;
  category: number;
  grade: number;
  total_file_duration: number;
  file_type: FileType;
  auto_delete_remain_hours: null;
  story_idx: number | null;
  catchInfo?: {
    resolution_type: string;
    thumb: string;
  };
};

type FileType = "REVIEW" | "CLIP" | "CATCH" | "NORMAL";

type Flag = "SUCCEED" | "ADULT";

type UserID = string;

type UserNick = string;

type Links = {
  first: string;
  last: string;
  prev: null;
  next: null;
};

type Meta = {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
};
