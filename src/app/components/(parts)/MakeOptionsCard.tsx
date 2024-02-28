import React from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

import { SongData, FilterOptions } from '../../types';

import Container from 'react-bootstrap/Container';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';

import { CaretDownFill, CaretUpFill } from "react-bootstrap-icons";

const MakeOptionsCard = ({ sortOptions, setSortOptions, isOptionTabOpen, setIsOptionTabOpen, sortOptionsErrorMessage, setSortOptionsErrorMessage }: { sortOptions: FilterOptions, setSortOptions: React.Dispatch<React.SetStateAction<FilterOptions>>, isOptionTabOpen: boolean, setIsOptionTabOpen: React.Dispatch<React.SetStateAction<boolean>>, sortOptionsErrorMessage: string, setSortOptionsErrorMessage: React.Dispatch<React.SetStateAction<string>> }) => {
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
            <Form.Group className="mb-3" style={{ maxWidth: "300px" }}
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
            </Form.Group>
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
                  // e.target.value = "1";
                  setSortOptionsErrorMessage("有効な開始値を入力してください。");
                } else if (parseInt(e.target.value) > sortOptions.bpmRangeEnd) {
                  // e.target.value = sortOptions.bpmRangeEnd.toString();
                  setSortOptionsErrorMessage("終了値より小さい開始値を入力してください。");
                } else {
                  setSortOptionsErrorMessage("");
                  setSortOptions({ ...sortOptions, bpmRangeStart: parseInt(e.target.value) });
                }
              }}
              // value={sortOptionsErrorMessage !== "" && sortOptions.bpmRangeStart.toString()}
              // disabled={isSearching}
              />
              <Form.Control type="number" placeholder="終了値(1000以下)" onChange={e => {
                // 1000以下
                if (parseInt(e.target.value) > 1000) {
                  // e.target.value = "1000";
                  setSortOptionsErrorMessage("1000以下の終了値を入力してください。");
                } else if (e.target.value === "") {
                  // e.target.value = "300";
                  setSortOptionsErrorMessage("有効な終了値を入力してください。");
                } else if (parseInt(e.target.value) < sortOptions.bpmRangeStart) {
                  // e.target.value = sortOptions.bpmRangeStart.toString();
                  setSortOptionsErrorMessage("開始値より大きい終了値を入力してください。");
                } else {
                  setSortOptionsErrorMessage("");
                  setSortOptions({ ...sortOptions, bpmRangeEnd: parseInt(e.target.value) });
                }
              }}
              // value={sortOptions.bpmRangeEnd}
              // disabled={isSearching}
              />
            </Form.Group>
            <Form.Group className="mb-3" style={{ maxWidth: "300px" }}
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
            {sortOptionsErrorMessage && <span style={{ color: "red" }}>{sortOptionsErrorMessage}</span>}
          </Form>
        </div>
      </Collapse>
    </Container>
  )

};

export default MakeOptionsCard;