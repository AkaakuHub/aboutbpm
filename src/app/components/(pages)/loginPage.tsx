"use client";

import React, { ReactElement } from "react";
import { useState, useEffect } from "react";

import { SongData, FilterOptions, SearchResult } from '../../types';
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

import Container from 'react-bootstrap/Container';

import { judgeStatus, fetch_searchMusicSimple, fetch_doClientCredentials } from '../../libs/APIhandler';

import MakeCard from "@/app/components/(parts)/MakeCard";
import { MakeOptionsCard, MakeSortHeaderCard } from "@/app/components/(parts)/MakeOptionsCard";

const Page = () => {
  const [initialWindowHeight, setInitialWindowHeight] = useState<number>(0);
  // const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  // const [makeCardResults, setMakeCardResults] = useState<ReactElement | null>(null);

  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [isOptionTabOpen, setIsOptionTabOpen] = useState<boolean>(false);
  const [sortOptions, setSortOptions] = useState<FilterOptions>({
    order: "desc",
    bpmRangeStart: 1,
    bpmRangeEnd: 300,
    muteWords: [],
    isKeyShown: false,
    sortOption: "bpm",
    sortOptionInSameBPM: "none",
  });
  const [sortOptionsErrorMessage, setSortOptionsErrorMessage] = useState<string>("");

  const searchMusicSimpleAPI = async (query: string) => {
    setIsSearching(true);
    const res = await fetch_searchMusicSimple(query);
    if (judgeStatus(res.status)) {
      const data = await res.json();
      setSearchResults(data);
    }
    setIsSearching(false);
  };

  const doClientCredentialsAPI = async () => {
    const res = await fetch_doClientCredentials();
    if (judgeStatus(res.status)) {
      const json = await res.json();
      try {
        const token = json.access_token;
        sessionStorage.setItem('temp_token', token);
      }
      catch (error) {
        console.error('Error:', error);
        alert("サーバーエラーです。しばらくしてから再度お試しください。");
      }
      // reload
      window
        .location
        .reload();
    }
  }

  useEffect(() => {
    searchMusicSimpleAPI("");
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
      自分のSpotifyプレイリストによる検索、高度な検索(アニメタイトル、ジャンルなど)は<a onClick={() => {
        doClientCredentialsAPI();
      }}
        href="#"
      >こちら</a>
      <br />
      <br />
      <MakeOptionsCard sortOptions={sortOptions} setSortOptions={setSortOptions} isOptionTabOpen={isOptionTabOpen} setIsOptionTabOpen={setIsOptionTabOpen} sortOptionsErrorMessage={sortOptionsErrorMessage} setSortOptionsErrorMessage={setSortOptionsErrorMessage} />
      <br />
      <br />
      <Container>
        <Form>
          <Form.Control type="text" placeholder="曲名またはアーティスト名を入力"
            onChange={e => {
              // setQuery(e.target.value);
              searchMusicSimpleAPI(e.target.value);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }
            }
          />
        </Form>
        <br />
        <span className="col d-flex justify-content-center" style={{
          opacity: isSearching ? 1 : 0,
        }}
        >
          <Spinner animation="grow" role="status" variant="primary">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </span>
        <MakeSortHeaderCard sortOptions={sortOptions} setSortOptions={setSortOptions} />
        {searchResults && (
          <div>
            <MakeCard data={searchResults} option={sortOptions} windowHeight={initialWindowHeight} />
          </div>
        )
        }
      </Container>
    </div >
  );
}

export default Page;