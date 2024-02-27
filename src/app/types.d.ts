export type SongData = {
  title: string;
  artist: string;
  bpm: number;
  is_checked: boolean;
}

export interface FilterOptions {
  order: string;
  bpmRangeStart: number;
  bpmRangeEnd: number;
  muteWords: string[];
}