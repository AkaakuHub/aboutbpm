// searchMusicAdvanced
import { NextRequest } from "next/server";
import axios from 'axios';

import { SongData, SearchResult } from '../../types';

import extractMusicData from "@/app/libs/ExtractMusicData";

import jsonData_temp from '../../components/data.json';
const jsonData: { [key: string]: SongData } = jsonData_temp;

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const query = requestBody.query;
    const token = requestBody.token;
    const res = await searchMusicAdvanced(query, token);
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

const searchMusicAdvanced = async (query: string, token: string) => {
  try {
    let resultData: SearchResult = { included: [], notIncluded: [] };
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: query,
        type: 'track',
        limit: 50
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-Language': 'ja'
      }
    });
    const data = response.data.tracks.items;
    // console.log(data);
    const onlyIdArray: string[] = extractMusicData(data, "searchAdvanced") as string[];
    // ここから、jsonDataを検索して、idが一致するものをresultDataに追加する
    for (const id in jsonData) {
      if (jsonData.hasOwnProperty(id)) {
        const element = jsonData[id as keyof typeof jsonData];
        if (onlyIdArray.includes(id)) {
          // 既に追加されてるなかで、同じtitleとartist, bpmを持つものがあれば追加しない
          if (resultData.included.some(e => e.songData.title === element.title && e.songData.artist === element.artist && e.songData.bpm === element.bpm)) {
            continue;
          }
          resultData.included.push({ id: id, songData: element });
        }
      }
    }
    return resultData;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return {};
    }
    console.error('検索エラー:', error);
    // はじめの500文字だけ表示
    // console.error('検索エラー:', error.message.substring(0, 500));
  }
}