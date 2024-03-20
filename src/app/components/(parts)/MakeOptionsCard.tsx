import React, { use, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

import { SongData, FilterOptions } from '../../types';

import Container from 'react-bootstrap/Container';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';

import { CaretDownFill, CaretUpFill } from "react-bootstrap-icons";

type Props = {
  sortOptions: FilterOptions,
  setSortOptions: React.Dispatch<React.SetStateAction<FilterOptions>>,
  isOptionTabOpen: boolean,
  setIsOptionTabOpen: React.Dispatch<React.SetStateAction<boolean>>,
  sortOptionsErrorMessage: string,
  setSortOptionsErrorMessage: React.Dispatch<React.SetStateAction<string>>
}

const MakeOptionsCard: React.FC<Props> = (
  {
    sortOptions,
    setSortOptions,
    isOptionTabOpen,
    setIsOptionTabOpen,
    sortOptionsErrorMessage,
    setSortOptionsErrorMessage
  }
) => {
  return (
    <Container>
      <span className='row'
        style={{
          borderBottom: "1px solid #e0e0e0", marginBottom: "10px", cursor: "pointer", backgroundColor: "#f6f6f6", padding: "8px", borderRadius: "8px"
        }}
        onClick={() => setIsOptionTabOpen(isOptionTabOpen => !isOptionTabOpen)}
      >
        <span >
          検索オプション
        </span>
        <span>
          <span
            className="ml-2"
          >
            {isOptionTabOpen ? <CaretUpFill size={28}
            /> : <CaretDownFill size={28}
            />}
          </span>
        </span>
      </span>
      <Collapse in={isOptionTabOpen}>
        <div id="form-collapse-text"
          style={{ border: "1px solid #e0e0e0", padding: "12px", borderRadius: "8px" }}
        >
          <Form>
            {/* <Form.Group className="mb-3" style={{ maxWidth: "300px" }}
            >
              <Form.Label>並び替え</Form.Label>
              <Form.Control as="select" onChange={e => {
                setSortOptions({ ...sortOptions, order: e.target.value });
              }}
                value={sortOptions.order}
              // disabled={isSearching}
              >
                <option value="desc">降順</option>
                <option value="asc">昇順</option>
              </Form.Control>
            </Form.Group> */}
            <Form.Group className="mb-3" style={{ maxWidth: "300px" }}
            >
              <Form.Label>BPM範囲(既定値: 1～300)
              </Form.Label>
              <Form.Control type="number" placeholder="開始値(1以上)" onChange={e => {
                // 1以上
                if (parseInt(e.target.value) < 1) {
                  // e.target.value = "1";
                  setSortOptionsErrorMessage("1以上の開始値を入力してください。");
                } else if (e.target.value === "") {
                  setSortOptionsErrorMessage("有効な開始値を入力してください。");
                } else if (parseInt(e.target.value) > sortOptions.bpmRangeEnd) {
                  // e.target.value = sortOptions.bpmRangeEnd.toString();
                  setSortOptionsErrorMessage("終了値以下の開始値を入力してください。");
                } else {
                  setSortOptionsErrorMessage("");
                  setSortOptions({ ...sortOptions, bpmRangeStart: parseInt(e.target.value) });
                }
              }}
              // value={sortOptions.bpmRangeStart.toString()}
              // disabled={isSearching}
              />
              <Form.Control type="number" placeholder="終了値(1000以下)" onChange={e => {
                // 1000以下
                if (parseInt(e.target.value) > 1000) {
                  // e.target.value = "1000";
                  setSortOptionsErrorMessage("1000以下の終了値を入力してください。");
                } else if (e.target.value === "") {
                  setSortOptionsErrorMessage("有効な終了値を入力してください。");
                } else if (parseInt(e.target.value) < sortOptions.bpmRangeStart) {
                  // e.target.value = sortOptions.bpmRangeStart.toString();
                  setSortOptionsErrorMessage("開始値以上の終了値を入力してください。");
                } else {
                  setSortOptionsErrorMessage("");
                  setSortOptions({ ...sortOptions, bpmRangeEnd: parseInt(e.target.value) });
                }
              }}
              // value={sortOptions.bpmRangeEnd}
              // disabled={isSearching}
              />
            </Form.Group>
            <Form.Group className="mb-3"
            >
              <Form.Label>ミュートワード</Form.Label>
              <Form.Control type="text" placeholder="スペース区切りで入力" onChange={e => {
                // もし空白なら空の配列
                if (/^\s*$/.test(e.target.value)) {
                  setSortOptions({ ...sortOptions, muteWords: [] });
                } else {
                  setSortOptions({ ...sortOptions, muteWords: e.target.value.split(" ") });
                }
              }}
                value={sortOptions.muteWords.join(" ")}
              // disabled={isSearching}
              />
            </Form.Group>
            <hr />
            <Form.Group className="mb-3" style={{ maxWidth: "300px" }}
            >
              <Form.Label>キーの表示</Form.Label>
              <Form.Control as="select" onChange={e => {
                const isKeyShown = e.target.value === "true";
                let newSortOptions = { ...sortOptions };

                if (!isKeyShown) {
                  newSortOptions = {
                    ...newSortOptions,
                    sortOption: "bpm",
                    sortOptionInSameBPM: newSortOptions.sortOptionInSameBPM === "unique" ? "title" : newSortOptions.sortOptionInSameBPM,
                  };
                }

                newSortOptions.isKeyShown = isKeyShown;
                setSortOptions(newSortOptions);
              }}
                value={sortOptions.isKeyShown ? "true" : "false"}
              // disabled={isSearching}
              >
                <option value="false">しない</option>
                <option value="true">する</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" style={{ maxWidth: "300px" }}
            >
              <Form.Label>同じ
                {sortOptions.sortOption === "key" ? "キー" : "BPM"}内での曲の並び替え</Form.Label>
              <Form.Control as="select" onChange={e => {
                if (!["title", "unique", "none"].includes(e.target.value)) {
                  return;
                }
                const value = e.target.value as "title" | "unique" | "none";
                setSortOptions({ ...sortOptions, sortOptionInSameBPM: value });
              }}
                value={sortOptions.sortOptionInSameBPM}
              // disabled={isSearching}
              >
                <option value="title">曲名</option>
                {
                  sortOptions.isKeyShown && <option value="unique">
                    {sortOptions.sortOption === "key" ? "BPM" : "キー"}
                  </option>
                }
                <option value="none">しない</option>
              </Form.Control>
            </Form.Group>
            {/*
            {
              sortOptions.isKeyShown && (
                <Form.Group className="mb-3" style={{ maxWidth: "300px" }}
                >
                  <Form.Label>キーでの並び替え</Form.Label>
                  <Form.Control as="select" onChange={e => {
                    setSortOptions({ ...sortOptions, isSortByKey: e.target.value === "true" });
                  }}
                    value={sortOptions.isSortByKey.toString()}
                  // disabled={isSearching}
                  >
                    <option value="false">しない</option>
                    <option value="true">する</option>
                  </Form.Control>
                </Form.Group>
              )
            } */}
            {sortOptionsErrorMessage && <span style={{ color: "red" }}>{sortOptionsErrorMessage}</span>}
          </Form>
        </div>
      </Collapse>
    </Container>
  )
};

type Props2 = {
  sortOptions: FilterOptions,
  setSortOptions: React.Dispatch<React.SetStateAction<FilterOptions>>,
}

const MakeSortHeaderCard: React.FC<Props2> = ({
  sortOptions,
  setSortOptions
}) => {
  const order: string = sortOptions.order;
  const isKeyShown: boolean = sortOptions.isKeyShown;
  const sortOption: "bpm" | "key" | "title" | "none" = sortOptions.sortOption;
  return <>
    <Card className="my-4">
      <Card.Body
        style={{ padding: "0.4rem" }}
      >
        <Card.Text style={{
          display: "flex",
          justifyContent: "flex-start",
          textAlign: "center",
          alignItems: "center"
        }}>
          <span className="col-1.5 border"
            onClick={() => {
              if (sortOption === "bpm") {
                setSortOptions({ ...sortOptions, order: order === "asc" ? "desc" : "asc" });
              } else {
                let newSortOptions = { ...sortOptions };
                newSortOptions = {
                  ...newSortOptions,
                  sortOption: "bpm",
                  order: "desc",
                }
                setSortOptions(newSortOptions);
              }
            }}
          >
            BPM
            {sortOption === "bpm" ? (order === "asc" ?
              <CaretUpFill size={28} />
              :
              <CaretDownFill size={28} />) : (
              <CaretUpFill size={28} style={{ opacity: 0 }} />
            )
            }
          </span>
          {/* <span className={isKeyShown ? "col-1" : "col-2"}>
          </span> */}
          {isKeyShown && (
            <>
              <span className='col-1'></span>
              <span className="col-3.5 d-flex justify-content-center border"
                onClick={() => {
                  if (sortOption === "key") {
                    setSortOptions({ ...sortOptions, order: order === "asc" ? "desc" : "asc" });
                  } else {
                    let newSortOptions = { ...sortOptions };
                    newSortOptions = {
                      ...newSortOptions,
                      sortOption: "key",
                      order: "desc",
                    }
                    setSortOptions(newSortOptions);
                  }
                }}
              >
                キー
                {sortOption === "key" ? (order === "asc" ?
                  <CaretUpFill size={28} />
                  :
                  <CaretDownFill size={28} />) : (
                  <CaretUpFill size={28} style={{ opacity: 0 }} />
                )
                }
              </span>
            </>

          )}
          <span className={isKeyShown ? "col-5" : "col-7"}>
            {/* <span className={`${isKeyShown ? "col-5" : "col-7"} border`}> */}
            {/* タイトル */}
          </span>
        </Card.Text>
      </Card.Body>
    </Card>
  </>
}

export { MakeOptionsCard, MakeSortHeaderCard };