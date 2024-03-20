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

import { SongData, FilterOptions, SearchResultObject, SearchResult } from '../../types';

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
  element: SearchResultObject;
  isKeyShown: boolean;
}

const convertKeyFromNumberToText = (key: number, mode: number) => {
  // 音楽のkeyは0~11の数字で表されるので、それを文字に変換する
  if (key === -1) {
    return "-";
  }
  //   const dict = ["C/Am", "D♭/B♭m", "D/Bm", "E♭/Cm", "E/D♭m", "F/Dm", "G♭/E♭m", "G/Em", "A♭/F♭", "A/G♭m", "B♭/Gm", "B/A♭m"];
  // const dict = ["C/Am", "Db/Bbm", "D/Bm", "Eb/Cm", "E/Dbm", "F/Dm", "Gb/Ebm", "G/Em", "Ab/Fb", "A/Gbm", "Bb/Gm", "B/Abm"];
  const dict = [["Am", "C"], ["Bbm", "Db"], ["Bm", "D"], ["Cm", "Eb"], ["Dbm", "E"], ["Dm", "F"], ["Ebm", "Gb"], ["Em", "G"], ["Fb", "Ab"], ["Gbm", "A"], ["Gm", "Bb"], ["Abm", "B"]];
  if (mode === -1) {
    return dict[key][1] + "/" + dict[key][0];
  } else {
    return dict[key][mode];
  }
}

const CardComponent: React.FC<CardProps> = (
  {
    element,
    isKeyShown
  }
) => {
  const [isHover, setIsHover] = useState(false);
  const id = element.id
  const songData = element.songData;
  return (
    <Card
      key={id}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Card.Body
        style={{ padding: "0.4rem" }}
      >
        <Card.Text style={{
          display: "flex",
          justifyContent: "flex-start",
          textAlign: "center",
          alignItems: "center"
        }}>
          <span className="col-1.5">{songData.bpm}</span>
          <span className={isKeyShown ? "col-1" : "col-2"}>
            {songData.is_checked ? <CheckCircle color="green" /> : <span> 　</span>}
          </span>
          {isKeyShown && (
            <span className="col-3 d-flex justify-content-center">
              {convertKeyFromNumberToText(songData.key, songData.mode)}
            </span>
          )}
          <span className={isKeyShown ? "col-5" : "col-7"}>
            <span className="row">
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>
                {songData.title}
              </span>
            </span>
            <span className="row">
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>
                {songData.artist}
              </span>
            </span>
          </span>
          {isHover ? (
            <span className="col-2"
              onClick={() => ContactMessageOnClick(songData.title, songData.artist, songData.bpm, songData.is_checked)}
              style={{ cursor: "pointer" }}
            >
              <OverlayTrigger
                placement="left"
                delay={{ show: 0, hide: 5000 }}
                overlay={(props: any) => renderTooltip(props, songData)}
              >
                <Envelope size={22} />
              </OverlayTrigger>
            </span>
          ) : <span className="col-2"></span>}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

const sortData = (data: SearchResult, option: FilterOptions) => {
  const sortByKey = option.sortOption === "key";
  const sortByTitle = option.sortOptionInSameBPM === "title";
  const sortByUnique = option.sortOptionInSameBPM === "unique";
  const isAscending = option.order === "asc";

  const sortIncluded = (a: SearchResultObject, b: SearchResultObject) => {
    if (sortByKey) {
      if (a.songData.key === b.songData.key) {
        if (sortByTitle) {
          return a.songData.title.localeCompare(b.songData.title);
        } else if (sortByUnique) {
          return a.songData.bpm - b.songData.bpm;
        }
      }
      return isAscending ? a.songData.key - b.songData.key : b.songData.key - a.songData.key;
    } else {
      if (a.songData.bpm === b.songData.bpm) {
        if (sortByTitle) {
          return a.songData.title.localeCompare(b.songData.title);
        } else if (sortByUnique) {
          return isAscending ? a.songData.key - b.songData.key : b.songData.key - a.songData.key;
        }
      }
      return isAscending ? a.songData.bpm - b.songData.bpm : b.songData.bpm - a.songData.bpm;
    }
  };

  const sortNotIncluded = (a: SearchResultObject, b: SearchResultObject) => sortIncluded(a, b);

  return {
    included: data.included.sort(sortIncluded),
    notIncluded: data.notIncluded.sort(sortNotIncluded),
  };
};

const MakeCard = (props: { data: SearchResult, option: FilterOptions, windowHeight: number }) => {
  let data = props.data;
  const option = props.option;
  if (data.included.length === 0 && data.notIncluded.length === 0) {
    return (
      <div>
        <p>何も見つかりませんでした...</p>
      </div>
    )
  }

  const isKeyShown: boolean = option.isKeyShown;

  // bpmRangeStart以上、bpmRangeEnd以下のものを抽出
  // data = data.filter((element: SearchResultObject) => {
  //   return option.bpmRangeStart <= element.songData.bpm && element.songData.bpm <= option.bpmRangeEnd;
  // });
  data = {
    included: data.included.filter((element: SearchResultObject) => {
      return option.bpmRangeStart <= element.songData.bpm && element.songData.bpm <= option.bpmRangeEnd;
    }),
    notIncluded: data.notIncluded
    // notIncluded: data.notIncluded.filter((element: SearchResultObject) => {
    //   return option.bpmRangeStart <= element.songData.bpm && element.songData.bpm <= option.bpmRangeEnd;
    // })
    // bpmはつねに-1だからsortしようがない !!
  }

  // muteWordsに含まれるものを除外
  // まず、trim
  option.muteWords = option.muteWords.map((word: string) => word.trim());
  // ""を除外
  option.muteWords = option.muteWords.filter((word: string) => word !== "");
  // data = data.filter((element: SearchResultObject) => {
  //   return !option.muteWords.some((word: string) => {
  //     return element.songData.title.includes(word) || element.songData.artist.includes(word);
  //   });
  // });
  data = {
    included: data.included.filter((element: SearchResultObject) => {
      return !option.muteWords.some((word: string) => {
        return element.songData.title.includes(word) || element.songData.artist.includes(word);
      });
    }),
    notIncluded: data.notIncluded.filter((element: SearchResultObject) => {
      return !option.muteWords.some((word: string) => {
        return element.songData.title.includes(word) || element.songData.artist.includes(word);
      });
    })
  }

  // if (option.sortOption === "key") {
  //   if (option.sortOptionInSameBPM === "title") {
  //     // 曲名ソートもわすれずに同時にbpmごとに行って
  //     if (option.order === "asc") {
  //       data = {
  //         included: data.included.sort((a, b) => {
  //           if (a.songData.key === b.songData.key) {
  //             if (a.songData.title < b.songData.title) {
  //               return -1;
  //             }
  //             if (a.songData.title > b.songData.title) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return a.songData.key - b.songData.key;
  //         }),
  //         notIncluded: data.notIncluded.sort((a, b) => {
  //           if (a.songData.key === b.songData.key) {
  //             if (a.songData.title < b.songData.title) {
  //               return -1;
  //             }
  //             if (a.songData.title > b.songData.title) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return a.songData.key - b.songData.key;
  //         })
  //       }
  //     } else if (option.order === "desc") {
  //       data = {
  //         included: data.included.sort((a, b) => {
  //           if (a.songData.key === b.songData.key) {
  //             if (a.songData.title < b.songData.title) {
  //               return -1;
  //             }
  //             if (a.songData.title > b.songData.title) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return b.songData.key - a.songData.key;
  //         }),
  //         notIncluded: data.notIncluded.sort((a, b) => {
  //           if (a.songData.key === b.songData.key) {
  //             if (a.songData.title < b.songData.title) {
  //               return -1;
  //             }
  //             if (a.songData.title > b.songData.title) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return b.songData.key - a.songData.key;
  //         })
  //       }
  //     }
  //   } else if (option.sortOptionInSameBPM === "unique") {
  //     // 曲名ソートもわすれずに同時にbpmごとに行って
  //     if (option.order === "asc") {
  //       data = {
  //         included: data.included.sort((a, b) => {
  //           if (a.songData.key === b.songData.key) {
  //             if (a.songData.bpm < b.songData.bpm) {
  //               return -1;
  //             }
  //             if (a.songData.bpm > b.songData.bpm) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return a.songData.key - b.songData.key;
  //         }),
  //         notIncluded: data.notIncluded.sort((a, b) => {
  //           if (a.songData.key === b.songData.key) {
  //             if (a.songData.bpm < b.songData.bpm) {
  //               return -1;
  //             }
  //             if (a.songData.bpm > b.songData.bpm) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return a.songData.key - b.songData.key;
  //         })
  //       }
  //     } else if (option.order === "desc") {
  //       data = {
  //         included: data.included.sort((a, b) => {
  //           if (a.songData.key === b.songData.key) {
  //             if (a.songData.bpm < b.songData.bpm) {
  //               return -1;
  //             }
  //             if (a.songData.bpm > b.songData.bpm) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return b.songData.key - a.songData.key;
  //         }),
  //         notIncluded: data.notIncluded.sort((a, b) => {
  //           if (a.songData.key === b.songData.key) {
  //             if (a.songData.bpm < b.songData.bpm) {
  //               return -1;
  //             }
  //             if (a.songData.bpm > b.songData.bpm) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return b.songData.key - a.songData.key;
  //         })
  //       }
  //     }
  //   } else {
  //     // bpmの昇順または降順でソート, 曲名は関係ない
  //     if (option.order === "asc") {
  //       // data.sort((a, b) => a.songData.key - b.songData.key);
  //       data.included.sort((a, b) => a.songData.key - b.songData.key);
  //       data.notIncluded.sort((a, b) => a.songData.key - b.songData.key);
  //     } else if (option.order === "desc") {
  //       // data.sort((a, b) => b.songData.key - a.songData.key);
  //       data.included.sort((a, b) => b.songData.key - a.songData.key);
  //       data.notIncluded.sort((a, b) => b.songData.key - a.songData.key);
  //     }
  //   }
  // } else {
  //   if (option.sortOptionInSameBPM === "title") {
  //     // 曲名ソートもわすれずに同時にbpmごとに行って
  //     if (option.order === "asc") {
  //       data = {
  //         included: data.included.sort((a, b) => {
  //           if (a.songData.bpm === b.songData.bpm) {
  //             if (a.songData.title < b.songData.title) {
  //               return -1;
  //             }
  //             if (a.songData.title > b.songData.title) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return a.songData.bpm - b.songData.bpm;
  //         }),
  //         notIncluded: data.notIncluded.sort((a, b) => {
  //           if (a.songData.bpm === b.songData.bpm) {
  //             if (a.songData.title < b.songData.title) {
  //               return -1;
  //             }
  //             if (a.songData.title > b.songData.title) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return a.songData.bpm - b.songData.bpm;
  //         })
  //       }
  //     } else if (option.order === "desc") {
  //       data = {
  //         included: data.included.sort((a, b) => {
  //           if (a.songData.bpm === b.songData.bpm) {
  //             if (a.songData.title < b.songData.title) {
  //               return -1;
  //             }
  //             if (a.songData.title > b.songData.title) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return b.songData.bpm - a.songData.bpm;
  //         }),
  //         notIncluded: data.notIncluded.sort((a, b) => {
  //           if (a.songData.bpm === b.songData.bpm) {
  //             if (a.songData.title < b.songData.title) {
  //               return -1;
  //             }
  //             if (a.songData.title > b.songData.title) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return b.songData.bpm - a.songData.bpm;
  //         })
  //       }
  //     }
  //   } else if (option.sortOptionInSameBPM === "unique") {
  //     // 曲名ソートもわすれずに同時にbpmごとに行って
  //     if (option.order === "asc") {
  //       data = {
  //         included: data.included.sort((a, b) => {
  //           if (a.songData.bpm === b.songData.bpm) {
  //             if (a.songData.key < b.songData.key) {
  //               return -1;
  //             }
  //             if (a.songData.key > b.songData.key) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return a.songData.bpm - b.songData.bpm;
  //         }),
  //         notIncluded: data.notIncluded.sort((a, b) => {
  //           if (a.songData.bpm === b.songData.bpm) {
  //             if (a.songData.key < b.songData.key) {
  //               return -1;
  //             }
  //             if (a.songData.key > b.songData.key) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return a.songData.bpm - b.songData.bpm;
  //         })
  //       }
  //     } else if (option.order === "desc") {
  //       data = {
  //         included: data.included.sort((a, b) => {
  //           if (a.songData.bpm === b.songData.bpm) {
  //             if (a.songData.key < b.songData.key) {
  //               return -1;
  //             }
  //             if (a.songData.key > b.songData.key) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return b.songData.bpm - a.songData.bpm;
  //         }),
  //         notIncluded: data.notIncluded.sort((a, b) => {
  //           if (a.songData.bpm === b.songData.bpm) {
  //             if (a.songData.key < b.songData.key) {
  //               return -1;
  //             }
  //             if (a.songData.key > b.songData.key) {
  //               return 1;
  //             }
  //             return 0;
  //           }
  //           return b.songData.bpm - a.songData.bpm;
  //         })
  //       }
  //     }
  //   } else {
  //     // bpmの昇順または降順でソート, 曲名は関係ない
  //     if (option.order === "asc") {
  //       // data.sort((a, b) => a.songData.bpm - b.songData.bpm);
  //       data.included.sort((a, b) => a.songData.bpm - b.songData.bpm);
  //       data.notIncluded.sort((a, b) => a.songData.bpm - b.songData.bpm);
  //     } else if (option.order === "desc") {
  //       // data.sort((a, b) => b.songData.bpm - a.songData.bpm);
  //       data.included.sort((a, b) => b.songData.bpm - a.songData.bpm);
  //       data.notIncluded.sort((a, b) => b.songData.bpm - a.songData.bpm);
  //     }
  //   }
  // }

  data = sortData(data, option);

  // option.isSpotifyPlaylistがtrueの場合、入ってる/ない2つに分ける
  if (data.notIncluded.length === 0) {
    const itemCount = data.included.length;
    const itemSize = 70; // 高さ
    const Item = ({ index, style }: { index: number, style: React.CSSProperties }) => {
      const element = data.included[index];
      return (
        <div style={style} key={option.order + option.bpmRangeStart + option.bpmRangeEnd + option.muteWords.join('') + index}>
          <CardComponent key={element.id} element={element} isKeyShown={isKeyShown} />

        </div>
      );
    };
    const itemNumInWindow = Math.floor(props.windowHeight / itemSize - 2);
    return (
      <span>
        {itemCount}件見つかりました
        <List
          height={itemSize * itemNumInWindow}
          itemCount={itemCount}
          itemSize={itemSize}
          width='100%'
          className='VirtualizedList'
        >
          {Item}
        </List>
      </span>
    );
  } else {
    const itemCount1 = data.included.length;
    const itemCount2 = data.notIncluded.length;
    const itemSize = 70; // 高さ
    const Item1 = ({ index, style }: { index: number, style: React.CSSProperties }) => {
      const element = data.included[index];
      return (
        <div style={style} key={option.order + option.bpmRangeStart + option.bpmRangeEnd + option.muteWords.join('') + index}>
          <CardComponent key={element.id} element={element} isKeyShown={isKeyShown} />
        </div>
      );
    };
    const Item2 = ({ index, style }: { index: number, style: React.CSSProperties }) => {
      const element = data.notIncluded[index];
      return (
        <div style={style} key={option.order + option.bpmRangeStart + option.bpmRangeEnd + option.muteWords.join('') + index}>
          <CardComponent key={element.id} element={element} isKeyShown={isKeyShown} />

        </div>
      );
    };
    const itemNumInWindow = Math.floor(props.windowHeight / itemSize - 2);
    return (
      <span>
        {data.included.length !== 0 && (
          <>
            {itemCount1}件見つかりました。
            <List
              height={itemSize * itemNumInWindow}
              itemCount={itemCount1}
              itemSize={itemSize}
              width='100%'
              className='VirtualizedList'
            >
              {Item1}
            </List>
          </>
        )
        }
        データベースにない曲が{itemCount2}件見つかりました。<br />
        もしよろしければお問い合わせからプレイリストIDを送信していただくとデータベースに追加されます。
        <List
          height={itemSize * itemNumInWindow}
          itemCount={itemCount2}
          itemSize={itemSize}
          width='100%'
          className='VirtualizedList'
        >
          {Item2}
        </List>
      </span>
    );
  }
};

export default MakeCard;
