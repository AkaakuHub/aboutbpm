"use client";

import React, { use } from "react";
import { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";

import { SongData, FilterOptions, SearchResult } from '../../types';
import Form from 'react-bootstrap/Form';
import { Container } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';

import { judgeStatus, fetch_searchMusicAdvanced, fetch_searchMusicByPlaylist } from '../../libs/APIhandler';

import MakeCard from "@/app/components/(parts)/MakeCard";
import MakeOptionsCard from "@/app/components/(parts)/MakeOptionsCard";

// tokenを受け取る
const Page = (props: { token: string }) => {
  const [initialWindowHeight, setInitialWindowHeight] = useState<number>(0);
  // const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  const [query, setQuery] = useState<string>("");

  const [isOptionTabOpen, setIsOptionTabOpen] = useState<boolean>(false);
  const [sortOptions, setSortOptions] = useState<FilterOptions>({
    order: "desc",
    bpmRangeStart: 1,
    bpmRangeEnd: 300,
    muteWords: [],
  });
  const [sortOptionsErrorMessage, setSortOptionsErrorMessage] = useState<string>("");

  const searchMusicAdvancedAPI = async (query: string) => {
    // queryがSpotifyのプレイリストのURLかどうかを判定, IDが22文字の英数字であることを確認
    const isSpotifyPlaylist: boolean = query.match(/https:\/\/open.spotify.com\/playlist\/[a-zA-Z0-9]{22}/) ? true : false;
    setIsSearching(true);
    let data;
    if (isSpotifyPlaylist) {
      const playlistID = query.split('?')[0].split("/")[4];
      const res = await fetch_searchMusicByPlaylist(playlistID, props.token);
      if (judgeStatus(res.status)) {
        data = await res.json();
      }
    } else {
      const res = await fetch_searchMusicAdvanced(query, props.token);
      if (judgeStatus(res.status)) {
        data = await res.json();
      }
    }
    setSearchResults(data);
    setIsSearching(false);
  };

  const [remainingCount, setRemainingCount] = useState<number>(10);
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingCount(remainingCount => remainingCount - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSearchResults({ included: [], notIncluded: [] });
  }
    , []);

  useEffect(() => {
    setInitialWindowHeight(window.innerHeight);
    window.addEventListener('resize', () => {
      setInitialWindowHeight(window.innerHeight);
    });
  }, []);

  return (
    <div>
      (おまけ機能)
      <br />
      高度な検索では、アニメタイトルやジャンルによる検索をSpotify APIを用いて行っています。(最大50件)
      <br />
      <br />
      また、SpotifyのプレイリストのURLを入力すると、そのプレイリストに含まれる曲のみで検索することができます。<sup>new!!</sup>
      <br />
      <Button variant="link" onClick={() => {
        sessionStorage.removeItem('temp_token');
        window
          .location
          .reload();
      }}
        disabled={remainingCount > 0}
      >簡易な検索に戻る
        {remainingCount > 0 ? <span>(残り{remainingCount}秒)</span> : <span></span>}
      </Button>
      <br />
      <br />
      <MakeOptionsCard sortOptions={sortOptions} setSortOptions={setSortOptions} isOptionTabOpen={isOptionTabOpen} setIsOptionTabOpen={setIsOptionTabOpen} sortOptionsErrorMessage={sortOptionsErrorMessage} setSortOptionsErrorMessage={setSortOptionsErrorMessage} />
      <br />
      <br />
      <Container>
        <div className="row"
        >
          <span className="col"
          >
            <Form>
              <Form.Control type="text" placeholder="語句またはSpotifyのプレイリストURLを入力"
                onChange={e => {
                  setQuery(e.target.value);
                  // searchMusicAdvancedAPI(e.target.value);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (query !== "") {
                      searchMusicAdvancedAPI(query);
                    }
                  }
                }
                }
              />
            </Form>
          </span>
          <span className="col-2"
          >
            <Button variant="primary" onClick={() => {
              searchMusicAdvancedAPI(query);
            }
            }
              disabled={isSearching}
            >検索
            </Button>
          </span>
        </div>
        {isSearching && (
          <>
            <br />
            <span className="col d-flex justify-content-center">
              <Spinner animation="grow" role="status" variant="primary" >
                <span className="sr-only">Loading...</span>
              </Spinner>
            </span>
          </>

        )}
        <br />
        {searchResults ? (
          <div>
            <MakeCard data={searchResults} option={sortOptions} windowHeight={initialWindowHeight} />
          </div>
        ) :
          (
            <span className="col d-flex justify-content-center">
              <Spinner animation="grow" role="status" variant="primary">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </span>
          )
        }
      </Container>
    </div>
  );
}

export default Page;