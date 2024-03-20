import { SongData } from '../types';

/**
 *"abcde": {
    "title": "test1",
    "artist": "hoge1",
    "bpm": 120.5,
    "key": 2,
    "mode": 1,
    "is_checked": true,
  },
 */

// 入ってきたdataから、上のように変換して、jsonで返す
const extractMusicData = (data: any, kind: string) => {
  let newMusicData: { [key: string]: SongData } = {};
  let onlyIdData: string[] = [];
  switch (kind) {
    case "playlist":
      data.forEach((element: any) => {
        const id: string = element.track.id;
        newMusicData[id] = {
          title: element.track.name,
          artist: element.track.artists[0].name,
          bpm: -1,
          key: -1,
          mode: -1,
          is_checked: false,
        }
      });
      return newMusicData;
      break;
    case "searchAdvanced":// idだけを抜き出す
      data.forEach((element: any) => {
        const id: string = element.id;
        onlyIdData.push(id);
      });
      return onlyIdData;
      break;
    default:
      return {};
      break;
  }
}

export default extractMusicData;