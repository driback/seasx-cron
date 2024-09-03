export type AfreecaTVStationsLinks = {
  medals: Medal[];
  links: Link[];
  channelart: Channelart;
  code?: number;
};

type Channelart = {
  station_no: number;
  pc_url: string;
  color: string;
  is_init: boolean;
  palettes: string[];
};

type Link = {
  no: number;
  type: number;
  link_name: string;
  code: string;
  image: null;
  url: string;
};

type Medal = {
  id: string;
  key: string;
  name: string;
  description: string;
};
