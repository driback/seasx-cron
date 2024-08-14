import type { File, QualityInfo } from "../afreecatv/types/vod";

export const hmsToSeconds = (timeString: string) => {
  const parts = timeString.split(":");

  if (parts.length === 2) {
    const [minutes, seconds] = parts.map(Number);
    return minutes! * 60 + seconds!;
  }

  const [hours, minutes, seconds] = parts.map(Number);
  return hours! * 3600 + minutes! * 60 + seconds!;
};

export const buildTempThumbnail = () => ({
  big: "",
  large: "",
  medium: "",
  small: "",
  original: "",
});

export const buildAfreecaTvPlaybackResource = (files: File[]) => {
  const results: QualityInfo[] = [];

  files.forEach((file) => {
    results.push(...file.quality_info);
  });

  const all = files.map((fi: { file: string }) => fi.file);

  const high = results.filter((re) => re.name === "original").map((re) => re.file);

  const medium = results
    .filter(({ name }) => name === "hd2k" || name === "hd4k")
    .map((re) => re.file);

  const low = results.filter((re) => re.name === "hd").map((re) => re.file);

  return { all, low, medium, high };
};

export const buildThumbnailSources = (url: string, type: "vod" | "channel") => {
  const thumbPrefix = type !== "channel" ? "vod" : "avatar";

  const sizes = ["small", "medium", "big", "large", "original"];

  const vodThumbs: Record<"small" | "medium" | "big" | "large" | "original", string> = {
    small: "",
    medium: "",
    big: "",
    large: "",
    original: "",
  };

  sizes.forEach((size) => {
    const prefix = `${size}_`;
    vodThumbs[size as keyof typeof vodThumbs] = `${url}?tr=n-${prefix}${thumbPrefix}_thumb`;
  });

  return vodThumbs;
};
