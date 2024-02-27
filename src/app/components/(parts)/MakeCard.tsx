/**
 *   "6svEV2VqOwqDFxp6LgQwRh": {
    "title": "幻日ミステリウム",
    "artist": "Aqours",
    "bpm": 151,
    "is_checked": false
  },のようなデータを受け取り、JSXに変換して返す
 */

import React, { use } from 'react';
import { useState, useEffect } from 'react';

import Card from 'react-bootstrap/Card';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';

import { SongData, FilterOptions } from '../../types';

import { CheckCircle } from 'react-bootstrap-icons';
import { Envelope } from 'react-bootstrap-icons';

import { FixedSizeList as List } from 'react-window';

const ContactMessageOnClick = (title: string, artist: string, bpm: number, is_checked: boolean) => {
  const mainText = `タイトル: ${title}\nアーティスト: ${artist}\nBPM: ${bpm}\n${is_checked ? "チェック済み" : "未チェック"}\nについて:\n(上記の文章は編集しないでください)\n--------------------\n`;
  const encodedMainText = encodeURIComponent(mainText);
  window.open(`contact?mainText=${encodedMainText}&kind=1`, '_blank');
}

const renderTooltip = (props: any, element: SongData) => (
  <Tooltip id="button-tooltip" {...props}>
    {element.title} - {element.artist} についての修正はこちら
  </Tooltip>
);

interface CardProps {
  element: { id: string, songData: SongData }
}

const CardComponent: React.FC<CardProps> = ({ element }) => {
  const [isHover, setIsHover] = useState(false);
  const id = element.id
  const songData = element.songData;
  return (
    <Card
      key={id}
      style={{ width: "100%" }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Card.Body>
        <Card.Text style={{
          display: 'flex', justifyContent: 'space-between', textAlign: 'center', alignItems: 'center'
        }}>
          <span className='col-1.3'>{songData.bpm}</span>
          <span className='col-1'>
            {songData.is_checked ? <CheckCircle color='green'
            /> : null}
          </span>
          <span className='col-7' style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{songData.title}</span>
          {
            isHover ? (
              <span className='col-1'
                onClick={() => ContactMessageOnClick(songData.title, songData.artist, songData.bpm, songData.is_checked)}
                style={{ cursor: 'pointer' }}
              >
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 0, hide: 5000 }}
                  overlay={(props: any) => renderTooltip(props, songData)}
                >
                  <Envelope size={22}
                  />
                </OverlayTrigger>
              </span>
            ) : <span className='col-1'></span>
          }
          <span className='col' style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{songData.artist}</span>
        </Card.Text>
      </Card.Body>
    </Card>
  );

};

const MakeCard = (props: { data: { id: string, songData: SongData }[], option: FilterOptions }) => {
  let data = props.data;
  const option = props.option;
  if (data.length === 0) {
    return (
      <div>
        <p>何も見つかりませんでした...</p>
      </div>
    )
  }

  // bpmRangeStart以上、bpmRangeEnd以下のものを抽出
  data = data.filter((element: { id: string, songData: SongData }) => {
    return option.bpmRangeStart <= element.songData.bpm && element.songData.bpm <= option.bpmRangeEnd;
  });

  // muteWordsに含まれるものを除外
  // まず、trim
  option.muteWords = option.muteWords.map((word: string) => word.trim());
  // ""を除外
  option.muteWords = option.muteWords.filter((word: string) => word !== "");
  data = data.filter((element: { id: string, songData: SongData }) => {
    return !option.muteWords.some((word: string) => {
      return element.songData.title.includes(word) || element.songData.artist.includes(word);
    });
  });

  if (option.order === "asc") {
    data.sort((a, b) => a.songData.bpm - b.songData.bpm);
  } else if (option.order === "desc") {
    data.sort((a, b) => b.songData.bpm - a.songData.bpm);
  }

  const itemCount = data.length;
  const itemSize = 70;
  const Item = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const element = data[index];
    return (
      <div style={style} key={option.order + option.bpmRangeStart + option.bpmRangeEnd + option.muteWords.join('') + index}>
        <CardComponent key={element.id} element={element} />
      </div>
    );
  };
  const itemNumInWindow = Math.floor(window.innerHeight / itemSize - 2);
  return (
    <List
      height={itemSize * itemNumInWindow}
      itemCount={itemCount}
      itemSize={itemSize}
      width='100%'
      className='VirtualizedList'
    >
      {Item}
    </List>
  );
};

export default MakeCard;