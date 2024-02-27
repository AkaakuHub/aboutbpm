"use client";

import React, { use } from "react";
import { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";

import { SongData, FilterOptions } from '../../types';
import Form from 'react-bootstrap/Form';
import { Container } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';

import { judgeStatus, fetch_searchMusicAdvanced } from '../../libs/APIhandler';

import MakeCard from "@/app/components/(parts)/MakeCard";
import MakeOptionsCard from "@/app/components/(parts)/MakeOptionsCard";

// tokenを受け取る
const Page = (props: { token: string }) => {
  // const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{ id: string, songData: SongData }[] | null>(null);

  const [query, setQuery] = useState<string>("");

  const [isOptionTabOpen, setIsOptionTabOpen] = useState<boolean>(false);
  const [sortOptions, setSortOptions] = useState<FilterOptions>({
    order: "desc",
    bpmRangeStart: 1,
    bpmRangeEnd: 300,
    muteWords: []
  });
  const [sortOptionsErrorMessage, setSortOptionsErrorMessage] = useState<string>("");

  const searchMusicAdvancedAPI = async (query: string) => {
    // console.log(query)
    setIsSearching(true);
    const res = await fetch_searchMusicAdvanced(query, props.token);
    // console.log(res);
    if (judgeStatus(res.status)) {
      const data = await res.json();
      setSearchResults(data);
      setIsSearching(false);
    }
  };

  const [remainingCount, setRemainingCount] = useState<number>(10);
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingCount(remainingCount => remainingCount - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSearchResults([]);
  }
    , []);

  return (
    <div>
      (おまけ機能)
      <br />
      <br />
      高度な検索では、アニメタイトルやジャンルによる検索をSpotify APIを用いて行っています。(最大50件)
      <br />
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
              <Form.Control type="text" placeholder="語句を入力"
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
            >検索</Button>
          </span>
        </div>
        <br />
        {searchResults ? (
          <div>
            {searchResults.length}件の検索結果
            <MakeCard data={searchResults} option={sortOptions} />
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