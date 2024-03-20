// searchMusicByPlaylist
import { NextRequest } from "next/server";
import axios from 'axios';

import { SongData, SearchResult } from '../../types';

import jsonData_temp from '../../components/data.json';
const jsonData: { [key: string]: SongData } = jsonData_temp;

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const query = requestBody.query;
    const token = requestBody.token;
    const res = await searchMusicByPlaylist(query, token);
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

const searchMusicByPlaylist = async (query: string, token: string) => {
  let resultData: SearchResult = { included: [], notIncluded: [] };
  // queryから、playlistの全てを取得
  let response = await axios.get(`https://api.spotify.com/v1/playlists/${query}/tracks`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept-Language': 'ja'
    }
  });
  let itemsFromSpotify = response.data.items;
  while (response.data.next) {
    response = await axios.get(response.data.next, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-Language': 'ja'
      }
    });
    itemsFromSpotify = [...itemsFromSpotify, ...response.data.items];
  }
  // itemsFromSpotifyから、id, songDataを取得
  const jsonDataLikeFromSpotify: { id: string, songData: SongData }[] = [];
  itemsFromSpotify.forEach((element: any) => {
    const id: string = element.track.id;
    if (jsonData.hasOwnProperty(id)) { //jsonDataに存在する場合
      jsonDataLikeFromSpotify.push({ id: id, songData: jsonData[id] });
    } else {
      const songData: SongData = {
        title: element.track.name,
        artist: element.track.artists[0].name,
        bpm: -1,
        key: -1,
        is_checked: false
      };
      jsonDataLikeFromSpotify.push({ id: id, songData: songData });
    }
  });
  // jsonDataLikeFromSpotifyから、jsonDataと比較してresultDataを作る
  jsonDataLikeFromSpotify.forEach((element) => {
    if (jsonData.hasOwnProperty(element.id)) {
      resultData.included.push(element);
    } else {
      resultData.notIncluded.push(element);
    }
  });
  // console.log(resultData.included.length, resultData.notIncluded.length);
  return resultData;
}
