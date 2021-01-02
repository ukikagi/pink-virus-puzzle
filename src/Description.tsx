import { Box } from "@material-ui/core";
import React from "react";
import ReactMarkdown from "react-markdown";

const description = `
# Pink Virus Puzzle
かつてパズルゲームサイト「[ぼらＱ](https://web.archive.org/web/20060116224359/http://boraq.hp.infoseek.co.jp/main.htm)」\
に掲載されていたパズルゲーム「Pink Virus」のクローンです。

## ルール
鍵を全部集めて出口を目指しましょう。
- 主人公は上下左右に移動することができます。
  - 移動は重力の影響を受けます：移動後、以下のいずれかの条件を満たすまで落下します。
    1. 主人公のいるマスにハシゴかロープが存在する。
    2. 主人公の下のマスに足場（レンガ・ブロック・ハシゴ・床）が存在する。
  - レンガとブロックのあるマスは通過することができません。
  - 上方向への移動はハシゴのあるマスでのみ可能です。
- 主人公は自分の左下・右下にあるレンガを破壊することができます。
  - 対象のレンガの上に他のレンガやブロックがある場合は破壊することができません。
  - 同時に破壊することができるレンガは5個までです。6個めのレンガを破壊すると最初に破壊したレンガが復活します。
  - 主人公が復活したレンガに埋まってしまった場合はゲームオーバーです。

## 操作方法
- ←/↑/→/↓: 移動
- Z/X: 左下・右下のレンガを壊す
- R: リスタート

## ソースコード
- <https://github.com/ukikagi/pink-virus-puzzle/>
`;

export const Description = () => (
  <Box style={{ textAlign: "left" }}>
    <ReactMarkdown children={description} />
  </Box>
);
