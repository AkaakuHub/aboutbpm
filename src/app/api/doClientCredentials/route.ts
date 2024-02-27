// doClientCredentials route

import { NextRequest } from "next/server";
import axios from 'axios';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export async function POST(req: NextRequest) {
  try {
    const res = await doClientCredentials();
    // console.log(res);
    if (Object.keys(res).length === 0) {
      return new Response('Unauthorized', { status: 401 });
    } else {
      return new Response(JSON.stringify(res), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
  }
  catch (error) {
    console.error('Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

const doClientCredentials = async () => {
  const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${token}`
    }
  };
  const data = {
    grant_type: 'client_credentials'
  };
  try {
    const res = await axios.post('https://accounts.spotify.com/api/token', data, config);
    return res.data;
  } catch (error) {
    console.error('Error:', error);
    return {};
  }
}