// modifyMusicAdmin
import { NextRequest } from "next/server";

import { SongData } from '../../types';

import jsonData_temp from '../../components/data.json';
const jsonData: { [key: string]: SongData } = jsonData_temp;

import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const query = requestBody.query;
    const kind = requestBody.kind;
    const res = await modifyMusicAdmin(query, kind);
    // console.log(res);
    return new Response(JSON.stringify(res), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }
  catch (error) {
    console.error('Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

const modifyMusicAdmin = async (query: string, kind: string) => {
  if (kind === "read") {
    // let resultData: SongData[] = [];
    let resultData: { id: string, songData: SongData }[] = [];
    // 今回は、jsonをそのまま返す
    // if (/^\s*$/.test(query)) { // queryが空白のみの場合
    //   return resultData;
    // }
    // queryは空白で区切って複数単語とみなす
    const keywords = query.split(/\s+/);
    // 大文字小文字は区別しない
    keywords.forEach((keyword, index, array) => {
      array[index] = keyword.toLowerCase();
    });
    for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        const element = jsonData[key as keyof typeof jsonData];
        if (keywords.every(keyword => element.title.toLowerCase().includes(keyword) || element.artist.toLowerCase().includes(keyword))) {
          // resultData.push(element);
          // 既に追加されてるなかで、同じtitleとartist, bpmを持つものがあれば追加しない
          // if (resultData.some(e => e.songData.title === element.title && e.songData.artist === element.artist && e.songData.bpm === element.bpm)) {
          //   continue;
          // }
          resultData.push({ id: key, songData: element });
        }
      }
    }
    return resultData;
  } else if (kind === "write") {
    try {
      // queryはjson形式の入ったarray
      const modifiedData: { id: string, songData: SongData }[] = JSON.parse(query);
      // これに基づいてjsonDataを書き換える、保存
      for (const element of modifiedData) {
        jsonData[element.id] = element.songData;
      }
      fs.writeFileSync('C:\\Users\\matsu\\github\\anisonbpm\\src\\app\\components\\data.json', JSON.stringify(jsonData, null, 2));
      return { id: "successfully saved.", songData: { title: "dummy", artist: "dummy", bpm: 0, is_checked: false } };
    } catch (error) {
      console.error('Error:', error);
      return { id: "failed to save.", songData: { title: "dummy", artist: "dummy", bpm: 0, is_checked: false } };
    }
  }
}