"use client";

import React, { ReactElement } from "react";
import { useState, useEffect } from "react";

import { SongData, FilterOptions } from '../../types';
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

import Container from 'react-bootstrap/Container';

import { judgeStatus, fetch_searchMusicSimple, fetch_doClientCredentials } from '../../libs/APIhandler';

import MakeCard from "@/app/components/(parts)/MakeCard";
import MakeOptionsCard from "@/app/components/(parts)/MakeOptionsCard";
import { SP } from "next/dist/shared/lib/utils";

const Page = () => {
  const [initialWindowHeight, setInitialWindowHeight] = useState<number>(0);
  // const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string, songData: SongData }[] | null>(null);
  // const [makeCardResults, setMakeCardResults] = useState<ReactElement | null>(null);

  const [isOptionTabOpen, setIsOptionTabOpen] = useState<boolean>(false);
  const [sortOptions, setSortOptions] = useState<FilterOptions>({
    order: "desc",
    bpmRangeStart: 1,
    bpmRangeEnd: 300,
    muteWords: []
  });
  const [sortOptionsErrorMessage, setSortOptionsErrorMessage] = useState<string>("");

  const searchMusicSimpleAPI = async (query: string) => {
    // console.log(query)
    const res = await fetch_searchMusicSimple(query);
    if (judgeStatus(res.status)) {
      const data = await res.json();
      setSearchResults(data);
    }
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
      高度な検索(アニメタイトル、ジャンルなど)は<a onClick={() => {
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
    </div >
  );
}

export default Page;