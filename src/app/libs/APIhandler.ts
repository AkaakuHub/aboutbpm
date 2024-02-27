const judgeStatus = (status: number) => {
  if (status === 401) {
    console.log('Unauthorized token');
    sessionStorage.removeItem('temp_token');
    sessionStorage.setItem('error_message', '無効なトークンです。はじめからやりなおしてください。');
    window.location.href = '/';
    return false;
  } else if (status === 500) {
    console.log('Internal server error');
    sessionStorage.removeItem('temp_token');
    sessionStorage.setItem('error_message', 'サーバーエラーです。はじめからやりなおしてください。');
    window.location.href = '/';
    return false;
  } else {
    return true;
  }
}

const fetch_doClientCredentials = async () => {
  const res = await fetch("api/doClientCredentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });
  return res;
}

const fetch_searchMusicSimple = async (query: string) => {
  const res = await fetch("api/searchMusicSimple", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: query })
  });
  return res;
}

const fetch_searchMusicAdvanced = async (query: string, token: string) => {
  const res = await fetch("api/searchMusicAdvanced", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: query, token: token })
  });
  return res;
}

export { fetch_doClientCredentials, judgeStatus, fetch_searchMusicSimple, fetch_searchMusicAdvanced };