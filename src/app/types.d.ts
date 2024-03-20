export type SongData = {
  title: string;
  artist: string;
  bpm: number;
  key: number;
  is_checked: boolean;
}

export type FilterOptions = {
  order: string;
  bpmRangeStart: number;
  bpmRangeEnd: number;
  muteWords: string[];
  isKeyShown: boolean;
  sortOption: "bpm" | "key";
  sortOptionInSameBPM: "title" | "unique" | "none"
}

export type SearchResultObject = {
  id: string;
  songData: SongData;
}

export type SearchResult = {
  included: SearchResultObject[],
  notIncluded: SearchResultObject[]
}
