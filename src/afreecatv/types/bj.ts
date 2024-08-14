export type AfreecaTVBj =
  | {
      RESULT: 1;
      DATA: Bj;
    }
  | {
      RESULT: 0;
      ERROR: string;
    };

type Bj = {
  station_no: string;
  user_id: string;
  user_nick: string;
  station_name: string;
  station_title: string;
  broad_start: string;
  total_broad_time: string;
  grade: string;
  fan_cnt: string;
  total_visit_cnt: string;
  total_ok_cnt: string;
  total_view_cnt: string;
  today_visit_cnt: string;
  today_ok_cnt: string;
  today_fav_cnt: string;
};
