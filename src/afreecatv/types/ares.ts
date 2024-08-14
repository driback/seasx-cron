export type AfreecaTVAres = {
  RESULT: number;
  MSG: string;
  DATA: Data;
};

type Data = {
  total_cnt: number;
  list_cnt: number;
  list: List[];
  more_yn: string;
};

type List = {
  align_type: AlignType;
  title_no: string;
  station_no: string;
  auth_no: string;
  bbs_no: string;
  title_name: string;
  thumb: string;
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
  is_subscribe: boolean;
  is_fanclub: boolean;
  scheme: string;
  is_ppv: boolean;
  webp_path: string;
  hash_tags: string[];
  category_tags: CategoryTag[];
  auto_hashtags: string[];
  data_type: DataType;
  list_view_session: ListViewSession;
  list_data_detail: DataType[];
  rec_detail: RecDetail;
  list_idx: number;
  sub_list_idx: number;
  original_user_id?: string;
  original_user_nick?: string;
  broad_no?: string;
};

type AlignType = "list";

type CategoryTag = "보라" | "토크";

type DataType = "rec_user_realtime" | "rec_user_batch";

type FileType = "CLIP" | "REVIEW" | "NORMAL" | "EDITOR";

type ListViewSession = "adult_poiloi009_1710713168";

type RecDetail = {
  pinsage: number;
  aftfrs?: number;
};
