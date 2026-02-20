import { useState, useEffect, useMemo, useCallback } from "react";

const BOND_CAP = { 1: 10, 2: 10, 3: 20, 4: 30, 5: 100 };
const getBondCap = (star) => BOND_CAP[star] || 20;

// ========== 生徒マスタ (253名 - EX: 愛用品Wiki準拠) ==========
const INIT_STUDENTS = [
  {id:"s000",name:"アカネ（バニーガール）",star:3,hasEx:false},{id:"s001",name:"アカリ（正月）",star:3,hasEx:false},{id:"s002",name:"アコ",star:3,hasEx:false},{id:"s003",name:"アコ（ドレス）",star:3,hasEx:false},{id:"s004",name:"アズサ",star:3,hasEx:false},{id:"s005",name:"アズサ（水着）",star:3,hasEx:false},{id:"s006",name:"アスナ（バニーガール）",star:3,hasEx:true},{id:"s007",name:"アスナ（制服）",star:3,hasEx:false},{id:"s008",name:"アツコ",star:3,hasEx:false},{id:"s009",name:"アリス",star:3,hasEx:true},{id:"s010",name:"アリス（メイド）",star:3,hasEx:true},{id:"s011",name:"アリス（臨戦）",star:3,hasEx:false},{id:"s012",name:"アル",star:3,hasEx:true},{id:"s013",name:"アル（正月）",star:3,hasEx:false},{id:"s014",name:"アル（ドレス）",star:3,hasEx:false},{id:"s015",name:"イオリ",star:3,hasEx:false},{id:"s016",name:"イオリ（水着）",star:3,hasEx:true},{id:"s017",name:"イズナ",star:3,hasEx:false},{id:"s018",name:"イズナ（水着）",star:3,hasEx:false},{id:"s019",name:"イズミ",star:3,hasEx:true},{id:"s020",name:"イズミ（正月）",star:3,hasEx:false},{id:"s021",name:"イチカ",star:3,hasEx:false},{id:"s022",name:"イロハ",star:3,hasEx:false},{id:"s023",name:"ウイ",star:3,hasEx:false},{id:"s024",name:"ウイ（水着）",star:3,hasEx:false},{id:"s025",name:"ウタハ（応援団）",star:3,hasEx:false},{id:"s026",name:"ウミカ",star:3,hasEx:true},{id:"s027",name:"エイミ",star:3,hasEx:true},{id:"s028",name:"エイミ（水着）",star:3,hasEx:false},{id:"s029",name:"エイミ（臨戦）",star:3,hasEx:false},{id:"s030",name:"エリ",star:3,hasEx:false},{id:"s031",name:"カエデ",star:3,hasEx:true},{id:"s032",name:"カズサ",star:3,hasEx:false},{id:"s033",name:"カズサ（バンド）",star:3,hasEx:false},{id:"s034",name:"カスミ",star:3,hasEx:false},{id:"s035",name:"カノエ",star:3,hasEx:false},{id:"s036",name:"カホ",star:3,hasEx:true},{id:"s037",name:"カヨコ（正月）",star:3,hasEx:false},{id:"s038",name:"カヨコ（ドレス）",star:3,hasEx:false},{id:"s039",name:"カリン",star:3,hasEx:false},{id:"s040",name:"カリン（バニーガール）",star:3,hasEx:false},{id:"s041",name:"カンナ",star:3,hasEx:false},{id:"s042",name:"カンナ（水着）",star:3,hasEx:false},{id:"s043",name:"キキョウ",star:3,hasEx:false},{id:"s044",name:"キキョウ（水着）",star:3,hasEx:false},{id:"s045",name:"キサキ",star:3,hasEx:false},{id:"s046",name:"キララ",star:3,hasEx:false},{id:"s047",name:"ケイ",star:3,hasEx:false},{id:"s048",name:"ココナ",star:3,hasEx:false},{id:"s049",name:"コタマ（キャンプ）",star:3,hasEx:false},{id:"s050",name:"コトリ（応援団）",star:3,hasEx:false},{id:"s051",name:"コハル",star:3,hasEx:false},{id:"s052",name:"コユキ",star:3,hasEx:true},{id:"s053",name:"サオリ",star:3,hasEx:true},{id:"s054",name:"サオリ（水着）",star:3,hasEx:false},{id:"s055",name:"サオリ（ドレス）",star:3,hasEx:false},{id:"s056",name:"サキ",star:3,hasEx:true},{id:"s057",name:"サキ（水着）",star:3,hasEx:false},{id:"s058",name:"サクラコ",star:3,hasEx:false},{id:"s059",name:"サクラコ（アイドル）",star:3,hasEx:false},{id:"s060",name:"サツキ",star:3,hasEx:false},{id:"s061",name:"サヤ",star:3,hasEx:false},{id:"s062",name:"サヤ（私服）",star:3,hasEx:true},{id:"s063",name:"シグレ",star:3,hasEx:false},{id:"s064",name:"シグレ（温泉）",star:3,hasEx:false},{id:"s065",name:"ジュリ（アルバイト）",star:3,hasEx:false},{id:"s066",name:"シュン",star:3,hasEx:false},{id:"s067",name:"シュン（幼女）",star:3,hasEx:true},{id:"s068",name:"シロコ",star:3,hasEx:true},{id:"s069",name:"シロコ（ライディング）",star:3,hasEx:false},{id:"s070",name:"シロコ（水着）",star:3,hasEx:false},{id:"s071",name:"シロコ＊テラー",star:3,hasEx:false},{id:"s072",name:"スズミ（マジカル）",star:3,hasEx:false},{id:"s073",name:"スバル",star:3,hasEx:false},{id:"s074",name:"スミレ",star:3,hasEx:true},{id:"s075",name:"スミレ（アルバイト）",star:3,hasEx:false},{id:"s076",name:"セイア",star:3,hasEx:false},{id:"s077",name:"セイア（水着）",star:3,hasEx:false},{id:"s078",name:"セナ",star:3,hasEx:false},{id:"s079",name:"セナ（私服）",star:3,hasEx:false},{id:"s080",name:"セリカ（正月）",star:3,hasEx:false},{id:"s081",name:"セリカ（水着）",star:3,hasEx:false},{id:"s082",name:"セリナ（クリスマス）",star:3,hasEx:false},{id:"s083",name:"タカネ",star:3,hasEx:false},{id:"s084",name:"チアキ",star:3,hasEx:false},{id:"s085",name:"チェリノ",star:3,hasEx:false},{id:"s086",name:"チェリノ（温泉）",star:3,hasEx:true},{id:"s087",name:"チセ（水着）",star:3,hasEx:true},{id:"s088",name:"チナツ（温泉）",star:3,hasEx:false},{id:"s089",name:"チヒロ",star:3,hasEx:false},{id:"s090",name:"ツクヨ",star:3,hasEx:false},{id:"s091",name:"ツクヨ（ドレス）",star:3,hasEx:false},{id:"s092",name:"ツバキ（ガイド）",star:3,hasEx:false},{id:"s093",name:"ツルギ",star:3,hasEx:true},{id:"s094",name:"トキ",star:3,hasEx:true},{id:"s095",name:"トキ（バニーガール）",star:3,hasEx:false},{id:"s096",name:"トモエ（チーパオ）",star:3,hasEx:false},{id:"s097",name:"ナギサ",star:3,hasEx:false},{id:"s098",name:"ナギサ（水着）",star:3,hasEx:false},{id:"s099",name:"ナグサ",star:3,hasEx:false},{id:"s100",name:"ナツ",star:3,hasEx:false},{id:"s101",name:"ナツ（バンド）",star:3,hasEx:false},{id:"s102",name:"ニヤ",star:3,hasEx:false},{id:"s103",name:"ネル",star:3,hasEx:true},{id:"s104",name:"ネル（バニーガール）",star:3,hasEx:false},{id:"s105",name:"ネル（制服）",star:3,hasEx:false},{id:"s106",name:"ノア",star:3,hasEx:false},{id:"s107",name:"ノア（パジャマ）",star:3,hasEx:false},{id:"s108",name:"ノゾミ",star:3,hasEx:false},{id:"s109",name:"ノドカ（温泉）",star:3,hasEx:false},{id:"s110",name:"ノノミ（水着）",star:3,hasEx:false},{id:"s111",name:"ハスミ（水着）",star:3,hasEx:false},{id:"s112",name:"ハナエ（クリスマス）",star:3,hasEx:true},{id:"s113",name:"ハナコ（水着）",star:3,hasEx:false},{id:"s114",name:"ハルカ（正月）",star:3,hasEx:false},{id:"s115",name:"ハルナ",star:3,hasEx:false},{id:"s116",name:"ハルナ（正月）",star:3,hasEx:false},{id:"s117",name:"ハルナ（体操服）",star:3,hasEx:true},{id:"s118",name:"ハレ（キャンプ）",star:3,hasEx:false},{id:"s119",name:"ヒカリ",star:3,hasEx:false},{id:"s120",name:"ヒナ",star:3,hasEx:true},{id:"s121",name:"ヒナ（水着）",star:3,hasEx:true},{id:"s122",name:"ヒナ（ドレス）",star:3,hasEx:false},{id:"s123",name:"ヒナタ",star:3,hasEx:true},{id:"s124",name:"ヒナタ（水着）",star:3,hasEx:false},{id:"s125",name:"ヒビキ",star:3,hasEx:true},{id:"s126",name:"ヒフミ",star:3,hasEx:false},{id:"s127",name:"ヒフミ（水着）",star:3,hasEx:true},{id:"s128",name:"ヒマリ",star:3,hasEx:false},{id:"s129",name:"ヒマリ（臨戦）",star:3,hasEx:false},{id:"s130",name:"ヒヨリ",star:3,hasEx:false},{id:"s131",name:"ヒヨリ（水着）",star:3,hasEx:false},{id:"s132",name:"フィーナ（ガイド）",star:3,hasEx:false},{id:"s133",name:"フウカ（正月）",star:3,hasEx:false},{id:"s134",name:"フブキ（水着）",star:3,hasEx:false},{id:"s135",name:"フユ",star:3,hasEx:false},{id:"s136",name:"ホシノ",star:3,hasEx:true},{id:"s137",name:"ホシノ（水着）",star:3,hasEx:false},{id:"s138",name:"ホシノ（臨戦）",star:3,hasEx:false},{id:"s140",name:"マキ",star:3,hasEx:false},{id:"s141",name:"マキ（キャンプ）",star:3,hasEx:false},{id:"s142",name:"マコト",star:3,hasEx:false},{id:"s143",name:"マシロ",star:3,hasEx:true},{id:"s144",name:"マシロ（水着）",star:3,hasEx:false},{id:"s145",name:"マリー（体操服）",star:3,hasEx:false},{id:"s146",name:"マリー（アイドル）",star:3,hasEx:false},{id:"s147",name:"マリナ",star:3,hasEx:false},{id:"s148",name:"マリナ（チーパオ）",star:3,hasEx:false},{id:"s149",name:"ミカ",star:3,hasEx:false},{id:"s150",name:"ミカ（水着）",star:3,hasEx:false},{id:"s151",name:"ミサキ",star:3,hasEx:true},{id:"s152",name:"ミサキ（水着）",star:3,hasEx:false},{id:"s153",name:"ミチル（ドレス）",star:3,hasEx:false},{id:"s154",name:"ミドリ",star:3,hasEx:true},{id:"s155",name:"ミドリ（メイド）",star:3,hasEx:false},{id:"s156",name:"ミナ",star:3,hasEx:false},{id:"s157",name:"ミネ",star:3,hasEx:false},{id:"s158",name:"ミノリ",star:3,hasEx:false},{id:"s159",name:"ミモリ",star:3,hasEx:true},{id:"s160",name:"ミモリ（水着）",star:3,hasEx:false},{id:"s161",name:"ミヤコ",star:3,hasEx:true},{id:"s162",name:"ミヤコ（水着）",star:3,hasEx:false},{id:"s163",name:"ミユ",star:3,hasEx:true},{id:"s164",name:"ミヨ",star:3,hasEx:false},{id:"s165",name:"ムツキ（正月）",star:3,hasEx:false},{id:"s166",name:"メグ",star:3,hasEx:false},{id:"s167",name:"メル",star:3,hasEx:false},{id:"s168",name:"モエ",star:3,hasEx:false},{id:"s169",name:"モエ（水着）",star:3,hasEx:false},{id:"s170",name:"モモイ（メイド）",star:3,hasEx:false},{id:"s171",name:"ヤクモ",star:3,hasEx:false},{id:"s172",name:"ユウカ（体操服）",star:3,hasEx:false},{id:"s173",name:"ユウカ（パジャマ）",star:3,hasEx:false},{id:"s174",name:"ユカリ",star:3,hasEx:false},{id:"s175",name:"ユカリ（水着）",star:3,hasEx:false},{id:"s176",name:"ユズ",star:3,hasEx:true},{id:"s177",name:"ユズ（臨戦）",star:3,hasEx:false},{id:"s178",name:"ヨシミ（バンド）",star:3,hasEx:false},{id:"s179",name:"リオ",star:3,hasEx:false},{id:"s180",name:"リオ（臨戦）",star:3,hasEx:false},{id:"s181",name:"リツ",star:3,hasEx:false},{id:"s182",name:"ルミ",star:3,hasEx:false},{id:"s183",name:"レイ",star:3,hasEx:false},{id:"s184",name:"レイサ",star:3,hasEx:false},{id:"s185",name:"レイサ（マジカル）",star:3,hasEx:false},{id:"s186",name:"レイジョ",star:3,hasEx:false},{id:"s187",name:"レンゲ",star:3,hasEx:true},{id:"s188",name:"ワカモ",star:3,hasEx:true},{id:"s189",name:"ワカモ（水着）",star:3,hasEx:true},{id:"s190",name:"御坂美琴",star:3,hasEx:false},{id:"s191",name:"初音ミク",star:3,hasEx:false},{id:"s192",name:"食蜂操祈",star:3,hasEx:false},
  {id:"s193",name:"アイリ",star:2,hasEx:false},{id:"s194",name:"アカネ",star:2,hasEx:false},{id:"s195",name:"アカリ",star:2,hasEx:false},{id:"s196",name:"アヤネ",star:2,hasEx:false},{id:"s197",name:"ウタハ",star:2,hasEx:true},{id:"s198",name:"カヨコ",star:2,hasEx:false},{id:"s199",name:"キリノ",star:2,hasEx:false},{id:"s200",name:"シズコ",star:2,hasEx:true},{id:"s201",name:"ジュンコ",star:2,hasEx:true},{id:"s202",name:"セリカ",star:2,hasEx:true},{id:"s203",name:"チセ",star:2,hasEx:true},{id:"s204",name:"ツバキ",star:2,hasEx:false},{id:"s205",name:"ノノミ",star:2,hasEx:true},{id:"s206",name:"ハスミ",star:2,hasEx:true},{id:"s207",name:"ハナエ",star:2,hasEx:false},{id:"s208",name:"ハナコ",star:2,hasEx:true},{id:"s209",name:"ハレ",star:2,hasEx:true},{id:"s210",name:"フウカ",star:2,hasEx:false},{id:"s211",name:"マリー",star:2,hasEx:true},{id:"s212",name:"ムツキ",star:2,hasEx:false},{id:"s213",name:"モミジ",star:2,hasEx:true},{id:"s214",name:"モモイ",star:2,hasEx:true},{id:"s215",name:"ユウカ",star:2,hasEx:true},{id:"s216",name:"レンゲ（水着）",star:2,hasEx:false},
  {id:"s217",name:"アイリ（バンド）",star:1,hasEx:false},{id:"s218",name:"アオバ",star:1,hasEx:false},{id:"s219",name:"アスナ",star:1,hasEx:false},{id:"s220",name:"アツコ（水着）",star:1,hasEx:false},{id:"s221",name:"アヤネ（水着）",star:1,hasEx:false},{id:"s222",name:"イズミ（水着）",star:1,hasEx:true},{id:"s223",name:"イチカ（水着）",star:1,hasEx:false},{id:"s224",name:"イブキ",star:1,hasEx:false},{id:"s225",name:"カリン（制服）",star:1,hasEx:false},{id:"s226",name:"キリノ（水着）",star:1,hasEx:false},{id:"s227",name:"コタマ",star:1,hasEx:false},{id:"s228",name:"コトリ",star:1,hasEx:true},{id:"s229",name:"コハル（水着）",star:1,hasEx:false},{id:"s230",name:"シズコ（水着）",star:1,hasEx:false},{id:"s231",name:"シミコ",star:1,hasEx:false},{id:"s232",name:"ジュリ",star:1,hasEx:false},{id:"s233",name:"ジュンコ（正月）",star:1,hasEx:false},{id:"s234",name:"スズミ",star:1,hasEx:true},{id:"s235",name:"セリナ",star:1,hasEx:false},{id:"s236",name:"チナツ",star:1,hasEx:true},{id:"s237",name:"ツルギ（水着）",star:1,hasEx:false},{id:"s238",name:"トキ（臨戦）",star:1,hasEx:false},{id:"s239",name:"トモエ",star:1,hasEx:false},{id:"s240",name:"ノドカ",star:1,hasEx:false},{id:"s241",name:"ハスミ（体操服）",star:1,hasEx:false},{id:"s242",name:"ハルカ",star:1,hasEx:false},{id:"s243",name:"ヒビキ（応援団）",star:1,hasEx:false},{id:"s244",name:"フィーナ",star:1,hasEx:false},{id:"s245",name:"フブキ",star:1,hasEx:false},{id:"s246",name:"ミチル",star:1,hasEx:true},{id:"s247",name:"ミネ（アイドル）",star:1,hasEx:false},{id:"s248",name:"ミユ（水着）",star:1,hasEx:false},{id:"s249",name:"ユズ（メイド）",star:1,hasEx:false},{id:"s250",name:"ヨシミ",star:1,hasEx:true},{id:"s251",name:"ラブ",star:1,hasEx:false},{id:"s252",name:"佐天涙子",star:1,hasEx:false},
];

// ========== 家具マスタ (188個) + シリーズ ==========
const SERIES_MAP={"2人用ミレニアムデスク":"ミレニアムタワーラウンジ","DJライブステージ":"DJパーティー会場","おせち料理のテーブル":"お正月","お正月のこたつ":"お正月","お正月の座布団":"お正月","お正月の提灯":"お正月","お正月の衣桁":"お正月","しゅっしゅっぽっぽ！ミニ列車セット":"ハイランダー列車","アビドス教室のカーディガンが置かれた机":"アビドス教室","アビドス教室のクジラ人形が置かれた机":"アビドス教室","アビドス教室のメガネが置かれた机":"アビドス教室","アビドス教室のリボンと手袋が置かれた机":"アビドス教室","アビドス教室の自転車":"アビドス教室","アビドス教室の覆面が置かれた机":"アビドス教室","エアホッケーゲーム機":"ゼリーズゲーセン","カラフルな大型プール":"サマーリゾート","カラフルな自販機":"ゼリーズゲーセン","カラーのシングルチェア":"モモフレンズのカフェ","カラーのマルチテレビ":"ゼリーズゲーセン","カラーの二段植木鉢":"モモフレンズのカフェ","カラーの長椅子":"モモフレンズのカフェ","ガラスの窓":"モモフレンズのカフェ","クラシックソファテーブルセット":"ゲヘナパーティー","グランドピアノ":"ゲヘナパーティー","ゲーム機用のウッドモニター":"ゲーム開発部","ゲーム開発部のソファー":"ゲーム開発部","サンシャイン・フラワープール":"サンシャインリゾート","サンシャイン・フラワー噴水":"サンシャインリゾート","スチール製の雑誌スタンド":"伝統的な温泉郷","ゼリーズのクレーンゲーム":"ゼリーズゲーセン","チル&クールアイスクリーム冷蔵庫":"ビーチサイド","デパートのデザイナーソファ":"デパート","ハイランダー自動改札機":"ハイランダー列車","ハロウィーンのパンプキンデザートテーブル":"ハロウィーンカフェ","ハロウィーンのパンプキンバーカウンター":"ハロウィーンカフェ","バイオレットパーティーテーブルセット":"ゲヘナパーティー","バレンタインのクッキーソファー":"バレンタイン","バレンタインのシングルチェア":"バレンタイン","バレンタインのティーテーブル":"バレンタイン","バレンタインの収納セット":"バレンタイン","ビーチサイドのふわふわ浮き輪":"ビーチサイド","ビーチサイドのクーリング扇風機":"ビーチサイド","ビーチサンベッドとミニテーブル":"DJパーティー会場","マッサージチェア":"伝統的な温泉郷","ミリタリーチェア・イエロー":"ミリタリーアウトドア","ミリタリーチェア・グリーン":"ミリタリーアウトドア","ミリタリーチェア・ピンク":"ミリタリーアウトドア","ミリタリーチェア・ブルー":"ミリタリーアウトドア","ミレニアムタワーラウンジのエスカレーター":"ミレニアムタワーラウンジ","モンステラの白い植木鉢":"サマーリゾート","レトロな三段積みアンプ":"サマーリゾート","レモンパラソルホワイトテーブル":"ビーチサイド","レースゲーム機":"ゼリーズゲーセン","保温庫":"伝統的な温泉郷","原木のテラステーブル":"ビーチサイド","原木の収納ケース":"ノーマル家具","原木の大型テーブル":"ノーマル家具","夏のパラソルセット":"サマーリゾート","大運動会のパン食い競走用スタンド":"大運動会","大運動会のマット・スカイブルー":"大運動会","大運動会のマット・ブルー":"大運動会","大運動会の休憩テント":"大運動会","大運動会の器具保管箱":"大運動会","大運動会の審判席":"大運動会","大運動会の応援スタンド":"大運動会","天蓋付きリゾートソファ":"サマーリゾート","折りたたみ式リゾートテーブル":"サマーリゾート","抹茶セット付きの座卓":"伝統的な温泉郷","書初め用のテーブル":"お正月","檜の浴槽":"伝統的な温泉郷","波模様の座椅子":"伝統的な温泉郷","浮き輪付きの小型プール":"サマーリゾート","海へのお出かけセット":"サマーリゾート","温泉カピバラのガチャガチャ":"伝統的な温泉郷","灯油ストーブと切り餅":"お正月","爽やかなフルーツバー":"ビーチサイド","甘くて涼しいかき氷バー":"ビーチサイド","白いコーヒーテーブル":"モモフレンズのカフェ","白いシンプルソファー":"ゼリーズゲーセン","百花繚乱専用ガンスタンド":"百鬼夜行","自動出入口パターン1":"輸送船","格闘ゲーム機":"ゼリーズゲーセン"};

const INIT_FURNITURE = [
  {id:"f000",name:"2人用ミレニアムデスク",type:"テーブル",cat:"furniture",targets:["s007","s225"]},{id:"f001",name:"DJライブステージ",type:"家電",cat:"decoration",targets:["s054"]},{id:"f002",name:"おせち料理のテーブル",type:"テーブル",cat:"furniture",targets:["s233","s116"]},{id:"f003",name:"お年玉用テーブル",type:"テーブル",cat:"furniture",targets:["s080"]},{id:"f004",name:"お月見テーブル",type:"テーブル",cat:"furniture",targets:["s020"]},{id:"f005",name:"お正月のお飾り台",type:"小物",cat:"furniture",targets:["s165"]},{id:"f006",name:"お正月のこたつ",type:"テーブル",cat:"furniture",targets:["s080"]},{id:"f007",name:"お正月の座布団",type:"椅子",cat:"furniture",targets:["s037"]},{id:"f008",name:"お正月の提灯",type:"小物",cat:"furniture",targets:["s246"]},{id:"f009",name:"お正月の衣桁",type:"小物",cat:"furniture",targets:["s133"]},{id:"f010",name:"お祭りお面陳列台",type:"小物",cat:"furniture",targets:["s026"]},{id:"f011",name:"しゅっしゅっぽっぽ！ミニ列車セット",type:"小物",cat:"furniture",targets:["s108","s119"]},{id:"f012",name:"どこでもばしゃばしゃプール",type:"小物",cat:"furniture",targets:["s044"]},{id:"f013",name:"アイスクリームテーブル",type:"テーブル",cat:"furniture",targets:["s229","s113"]},{id:"f014",name:"アイスプール",type:"小物",cat:"furniture",targets:["s028"]},{id:"f015",name:"アウトドアコーヒーテーブル",type:"テーブル",cat:"furniture",targets:["s118"]},{id:"f016",name:"アウトドアパーテーション",type:"小物",cat:"furniture",targets:["s049"]},{id:"f017",name:"アシストプルアップマシン",type:"小物",cat:"furniture",targets:["s075"]},{id:"f018",name:"アビドス教室のカーディガンが置かれた机",type:"テーブル",cat:"furniture",targets:["s205"]},{id:"f019",name:"アビドス教室のクジラ人形が置かれた机",type:"テーブル",cat:"furniture",targets:["s136"]},{id:"f020",name:"アビドス教室のメガネが置かれた机",type:"テーブル",cat:"furniture",targets:["s196"]},{id:"f021",name:"アビドス教室のリボンと手袋が置かれた机",type:"テーブル",cat:"furniture",targets:["s202"]},{id:"f022",name:"アビドス教室の自転車",type:"小物",cat:"furniture",targets:["s069"]},{id:"f023",name:"アビドス教室の覆面が置かれた机",type:"テーブル",cat:"furniture",targets:["s068"]},{id:"f024",name:"アビドス自転車整備スタンド",type:"小物",cat:"furniture",targets:["s071"]},{id:"f025",name:"アンティークな収納付きウッドデスク",type:"テーブル",cat:"furniture",targets:["s023"]},{id:"f026",name:"イブキのお勉強セット",type:"テーブル",cat:"furniture",targets:["s224"]},{id:"f027",name:"エアホッケーゲーム機",type:"家電",cat:"decoration",targets:["s154","s214"]},{id:"f028",name:"エキスパート向け移動標的",type:"小物",cat:"furniture",targets:["s139"]},{id:"f029",name:"カウンターチェア・ゴールドブラック",type:"椅子",cat:"furniture",targets:["s000"]},{id:"f030",name:"カウンターチェア・ゴールドレッドワイン",type:"椅子",cat:"furniture",targets:["s104"]},{id:"f031",name:"カウンターチェア・シルバーネオンブルー",type:"椅子",cat:"furniture",targets:["s006"]},{id:"f032",name:"カウンターチェア・ダークバイオレット",type:"椅子",cat:"furniture",targets:["s040"]},{id:"f033",name:"カウンターチェア・ディープブルー",type:"椅子",cat:"furniture",targets:["s095"]},{id:"f034",name:"カフェ用ベッド",type:"ベッド",cat:"furniture",targets:["s155","s170"]},{id:"f035",name:"カラフルな大型プール",type:"小物",cat:"furniture",targets:["s237"]},{id:"f036",name:"カラフルな自販機",type:"家電",cat:"decoration",targets:["s128"]},{id:"f037",name:"カラーのシングルチェア",type:"椅子",cat:"furniture",targets:["s002"]},{id:"f038",name:"カラーのマルチテレビ",type:"家電",cat:"decoration",targets:["s089"]},{id:"f039",name:"カラーの二段植木鉢",type:"小物",cat:"furniture",targets:["s211"]},{id:"f040",name:"カラーの長椅子",type:"椅子",cat:"furniture",targets:["s245"]},{id:"f041",name:"ガラスの窓",type:"壁の装飾",cat:"decoration",targets:["s053","s151"]},{id:"f042",name:"クラシックソファテーブルセット",type:"椅子",cat:"furniture",targets:["s003","s122"]},{id:"f043",name:"クラシックパターンスーツケース",type:"小物",cat:"furniture",targets:["s024"]},{id:"f044",name:"グランドピアノ",type:"小物",cat:"furniture",targets:["s122"]},{id:"f045",name:"ゲーム機用のウッドモニター",type:"家電",cat:"decoration",targets:["s154","s214"]},{id:"f046",name:"ゲーム開発部のスペース",type:"小物",cat:"furniture",targets:["s238","s180"]},{id:"f047",name:"ゲーム開発部のソファー",type:"椅子",cat:"furniture",targets:["s009"]},{id:"f048",name:"ゲーム開発部のロッカー",type:"クローゼット",cat:"furniture",targets:["s176"]},{id:"f049",name:"サンシャインレモンツリー",type:"小物",cat:"furniture",targets:["s113"]},{id:"f050",name:"サンシャイン・フラワープール",type:"小物",cat:"furniture",targets:["s175"]},{id:"f051",name:"サンシャイン・フラワー噴水",type:"小物",cat:"furniture",targets:["s220"]},{id:"f052",name:"シャワーブース",type:"クローゼット",cat:"furniture",targets:["s162"]},{id:"f053",name:"ジャイアントプールフロート",type:"小物",cat:"furniture",targets:["s134"]},{id:"f054",name:"ジュークボックス",type:"小物",cat:"furniture",targets:["s073"]},{id:"f055",name:"スイカ割りセット",type:"小物",cat:"furniture",targets:["s223","s111"]},{id:"f056",name:"スイングチェア",type:"椅子",cat:"furniture",targets:["s098"]},{id:"f057",name:"スキューバダイビングギア保管ラック",type:"小物",cat:"furniture",targets:["s057"]},{id:"f058",name:"スチール製の雑誌スタンド",type:"小物",cat:"furniture",targets:["s022"]},{id:"f059",name:"セイアのオープンカー",type:"小物",cat:"furniture",targets:["s077"]},{id:"f060",name:"セルフィーブース",type:"小物",cat:"furniture",targets:["s046"]},{id:"f061",name:"ゼリーズのクレーンゲーム",type:"家電",cat:"decoration",targets:["s052"]},{id:"f062",name:"タイプライターデスク",type:"テーブル",cat:"furniture",targets:["s164"]},{id:"f063",name:"タロットテーブル",type:"テーブル",cat:"furniture",targets:["s252"]},{id:"f064",name:"ダメにするソファ・白",type:"椅子",cat:"furniture",targets:["s107"]},{id:"f065",name:"ダメにするソファ・青",type:"椅子",cat:"furniture",targets:["s173"]},{id:"f066",name:"チル&クールアイスクリーム冷蔵庫",type:"家電",cat:"decoration",targets:["s018"]},{id:"f067",name:"ティーパーティーテーブル",type:"テーブル",cat:"furniture",targets:["s076","s097","s149"]},{id:"f068",name:"テレビデオ",type:"家電",cat:"decoration",targets:["s132"]},{id:"f069",name:"ディープブルーベース",type:"小物",cat:"furniture",targets:["s033"]},{id:"f070",name:"デパートのデザイナーソファ",type:"椅子",cat:"furniture",targets:["s092"]},{id:"f071",name:"ハイランダー自動改札機",type:"小物",cat:"furniture",targets:["s218"]},{id:"f072",name:"ハロウィーンのパンプキンデザートテーブル",type:"テーブル",cat:"furniture",targets:["s201"]},{id:"f073",name:"ハロウィーンのパンプキンバーカウンター",type:"テーブル",cat:"furniture",targets:["s193"]},{id:"f074",name:"バイオレットパーティーテーブルセット",type:"テーブル",cat:"furniture",targets:["s038"]},{id:"f075",name:"バタバタカジキの展示台",type:"小物",cat:"furniture",targets:["s070"]},{id:"f076",name:"バレンタインのクッキーソファー",type:"椅子",cat:"furniture",targets:["s188"]},{id:"f077",name:"バレンタインのシングルチェア",type:"椅子",cat:"furniture",targets:["s147"]},{id:"f078",name:"バレンタインのティーテーブル",type:"テーブル",cat:"furniture",targets:["s100"]},{id:"f079",name:"バレンタインの収納セット",type:"クローゼット",cat:"furniture",targets:["s032"]},{id:"f080",name:"バーベキューグリル",type:"小物",cat:"furniture",targets:["s081"]},{id:"f081",name:"パンケーキ・ティーテーブル",type:"テーブル",cat:"furniture",targets:["s065"]},{id:"f082",name:"ビーチのブランコ",type:"小物",cat:"furniture",targets:["s150"]},{id:"f083",name:"ビーチサイドのふわふわ浮き輪",type:"小物",cat:"furniture",targets:["s137"]},{id:"f084",name:"ビーチサイドのクーリング扇風機",type:"小物",cat:"furniture",targets:["s087"]},{id:"f085",name:"ビーチサンベッドとミニテーブル",type:"椅子",cat:"furniture",targets:["s152"]},{id:"f086",name:"ビーチフェスティバル用椅子",type:"椅子",cat:"furniture",targets:["s131"]},{id:"f087",name:"ピンク色のエレクトリックギター",type:"小物",cat:"furniture",targets:["s178"]},{id:"f088",name:"フリーボックス",type:"テーブル",cat:"furniture",targets:["s072","s185"]},{id:"f089",name:"フレッシュショップテーブル",type:"テーブル",cat:"furniture",targets:["s192"]},{id:"f090",name:"ヘルメット掃除キット",type:"小物",cat:"furniture",targets:["s251"]},{id:"f091",name:"ベーシック・エレクトリックキーボード",type:"小物",cat:"furniture",targets:["s217"]},{id:"f092",name:"マッサージチェア",type:"家電",cat:"decoration",targets:["s088"]},{id:"f093",name:"ミニキッチン",type:"小物",cat:"furniture",targets:["s129"]},{id:"f094",name:"ミニスツールとサンベッド",type:"ベッド",cat:"furniture",targets:["s124"]},{id:"f095",name:"ミリタリーキャンプボードの設置物",type:"小物",cat:"furniture",targets:["s141"]},{id:"f096",name:"ミリタリーチェア・イエロー",type:"椅子",cat:"furniture",targets:["s056"]},{id:"f097",name:"ミリタリーチェア・グリーン",type:"椅子",cat:"furniture",targets:["s163"]},{id:"f098",name:"ミリタリーチェア・ピンク",type:"椅子",cat:"furniture",targets:["s161"]},{id:"f099",name:"ミリタリーチェア・ブルー",type:"椅子",cat:"furniture",targets:["s168"]},{id:"f100",name:"ミレニアムタワーラウンジのエスカレーター",type:"壁の装飾",cat:"decoration",targets:["s105"]},{id:"f101",name:"ミレニアム製ピッチングマシン",type:"小物",cat:"furniture",targets:["s183"]},{id:"f102",name:"メッシュハンモック",type:"ベッド",cat:"furniture",targets:["s169"]},{id:"f103",name:"メンテナンスステーション",type:"小物",cat:"furniture",targets:["s011"]},{id:"f104",name:"モモフレンズのグッズ台",type:"小物",cat:"furniture",targets:["s190"]},{id:"f105",name:"モンステラの白い植木鉢",type:"小物",cat:"furniture",targets:["s090"]},{id:"f106",name:"ライフセーバー用椅子",type:"小物",cat:"furniture",targets:["s226"]},{id:"f107",name:"ライブステージ",type:"家電",cat:"decoration",targets:["s059","s146","s247"]},{id:"f108",name:"ラグジュアリービーチベッド",type:"ベッド",cat:"furniture",targets:["s150"]},{id:"f109",name:"ラーメンテーブル",type:"テーブル",cat:"furniture",targets:["s153"]},{id:"f110",name:"リズムの導き手",type:"小物",cat:"furniture",targets:["s101"]},{id:"f111",name:"リラックスチェア",type:"椅子",cat:"furniture",targets:["s043"]},{id:"f112",name:"レトロな三段積みアンプ",type:"家電",cat:"decoration",targets:["s189"]},{id:"f113",name:"レモンパラソルホワイトテーブル",type:"テーブル",cat:"furniture",targets:["s160"]},{id:"f114",name:"レースゲーム機",type:"家電",cat:"decoration",targets:["s094","s103"]},{id:"f115",name:"ロイヤルダイヤチェア",type:"椅子",cat:"furniture",targets:["s008"]},{id:"f116",name:"万能テーブル",type:"テーブル",cat:"furniture",targets:["s029"]},{id:"f117",name:"万魔殿のデスク",type:"テーブル",cat:"furniture",targets:["s060"]},{id:"f118",name:"万魔殿の掲示板",type:"小物",cat:"furniture",targets:["s084"]},{id:"f119",name:"中華風の椅子",type:"椅子",cat:"furniture",targets:["s156"]},{id:"f120",name:"中華風ホットショーケース",type:"クローゼット",cat:"furniture",targets:["s182"]},{id:"f121",name:"休憩用のベンチテーブル",type:"テーブル",cat:"furniture",targets:["s117"]},{id:"f122",name:"伝統的な格子の掃き出し窓",type:"壁の装飾",cat:"decoration",targets:["s017"]},{id:"f123",name:"保温庫",type:"家電",cat:"decoration",targets:["s086"]},{id:"f124",name:"原初のアバンギャルド",type:"小物",cat:"furniture",targets:["s179"]},{id:"f125",name:"原木のテラステーブル",type:"テーブル",cat:"furniture",targets:["s034","s184"]},{id:"f126",name:"原木の収納ケース",type:"クローゼット",cat:"furniture",targets:["s130"]},{id:"f127",name:"原木の大型テーブル",type:"テーブル",cat:"furniture",targets:["s078"]},{id:"f128",name:"原稿用の机",type:"テーブル",cat:"furniture",targets:["s167"]},{id:"f129",name:"取調室のテーブル",type:"テーブル",cat:"furniture",targets:["s041"]},{id:"f130",name:"古風な調理台",type:"家電",cat:"decoration",targets:["s187"]},{id:"f131",name:"図書館のクラシックな椅子",type:"椅子",cat:"furniture",targets:["s213"]},{id:"f132",name:"夏のパラソルセット",type:"テーブル",cat:"furniture",targets:["s144"]},{id:"f133",name:"夏色の水鉄砲スタンド",type:"クローゼット",cat:"furniture",targets:["s216"]},{id:"f134",name:"大聖堂の長椅子",type:"椅子",cat:"furniture",targets:["s058","s123","s211"]},{id:"f135",name:"大運動会のパン食い競走用スタンド",type:"小物",cat:"furniture",targets:["s241"]},{id:"f136",name:"大運動会のマット・スカイブルー",type:"小物",cat:"furniture",targets:["s172"]},{id:"f137",name:"大運動会のマット・ブルー",type:"小物",cat:"furniture",targets:["s050"]},{id:"f138",name:"大運動会の休憩テント",type:"椅子",cat:"furniture",targets:["s145"]},{id:"f139",name:"大運動会の器具保管箱",type:"小物",cat:"furniture",targets:["s106"]},{id:"f140",name:"大運動会の審判席",type:"椅子",cat:"furniture",targets:["s021"]},{id:"f141",name:"大運動会の応援スタンド",type:"小物",cat:"furniture",targets:["s025","s243"]},{id:"f142",name:"天蓋付きリゾートソファ",type:"椅子",cat:"furniture",targets:["s005"]},{id:"f143",name:"威厳の役員用デスク",type:"テーブル",cat:"furniture",targets:["s142"]},{id:"f144",name:"彫刻の作業台",type:"小物",cat:"furniture",targets:["s181"]},{id:"f145",name:"怪しげな大釜",type:"小物",cat:"furniture",targets:["s035"]},{id:"f146",name:"折りたたみ式リゾートテーブル",type:"テーブル",cat:"furniture",targets:["s110"]},{id:"f147",name:"折り紙テーブル",type:"テーブル",cat:"furniture",targets:["s174"]},{id:"f148",name:"抹茶セット付きの座卓",type:"テーブル",cat:"furniture",targets:["s109"]},{id:"f149",name:"救急箱ホワイトテーブル",type:"テーブル",cat:"furniture",targets:["s079"]},{id:"f150",name:"新鮮！魚箱",type:"小物",cat:"furniture",targets:["s248"]},{id:"f151",name:"暖かなクリスマス暖炉",type:"小物",cat:"furniture",targets:["s112"]},{id:"f152",name:"書初め用のテーブル",type:"テーブル",cat:"furniture",targets:["s013"]},{id:"f153",name:"最高級役員用デスク",type:"テーブル",cat:"furniture",targets:["s014","s038"]},{id:"f154",name:"木人椿",type:"小物",cat:"furniture",targets:["s148","s186"]},{id:"f155",name:"木工作業台",type:"テーブル",cat:"furniture",targets:["s158"]},{id:"f156",name:"格闘ゲーム機",type:"家電",cat:"decoration",targets:["s009","s103"]},{id:"f157",name:"植物棚",type:"クローゼット",cat:"furniture",targets:["s242","s114"]},{id:"f158",name:"檜の浴槽",type:"小物",cat:"furniture",targets:["s064","s166"]},{id:"f159",name:"水色のシングルソファ",type:"椅子",cat:"furniture",targets:["s010"]},{id:"f160",name:"水難救命ボックス",type:"小物",cat:"furniture",targets:["s042"]},{id:"f161",name:"波模様の座椅子",type:"椅子",cat:"furniture",targets:["s239"]},{id:"f162",name:"浮き輪付きの小型プール",type:"小物",cat:"furniture",targets:["s121"]},{id:"f163",name:"海へのお出かけセット",type:"小物",cat:"furniture",targets:["s221"]},{id:"f164",name:"温泉カピバラのガチャガチャ",type:"家電",cat:"decoration",targets:["s031"]},{id:"f165",name:"演説用の机",type:"テーブル",cat:"furniture",targets:["s096"]},{id:"f166",name:"灯油ストーブと切り餅",type:"家電",cat:"decoration",targets:["s244"]},{id:"f167",name:"爽やかなフルーツバー",type:"テーブル",cat:"furniture",targets:["s063"]},{id:"f168",name:"玄龍門の玉座",type:"椅子",cat:"furniture",targets:["s045"]},{id:"f169",name:"甘くて涼しいかき氷バー",type:"クローゼット",cat:"furniture",targets:["s230"]},{id:"f170",name:"白いコーヒーテーブル",type:"テーブル",cat:"furniture",targets:["s048"]},{id:"f171",name:"白いシンプルソファー",type:"椅子",cat:"furniture",targets:["s123"]},{id:"f172",name:"百夜堂の出張屋台",type:"小物",cat:"furniture",targets:["s200"]},{id:"f173",name:"百花繚乱専用ガンスタンド",type:"クローゼット",cat:"furniture",targets:["s099"]},{id:"f174",name:"百鬼夜行グッズの飾り棚",type:"クローゼット",cat:"furniture",targets:["s036"]},{id:"f175",name:"簡易更衣室",type:"小物",cat:"furniture",targets:["s091"]},{id:"f176",name:"自動出入口パターン1",type:"壁の装飾",cat:"decoration",targets:["s177"]},{id:"f177",name:"臼と杵",type:"小物",cat:"furniture",targets:["s001"]},{id:"f178",name:"芸術家の初作品",type:"小物",cat:"furniture",targets:["s135"]},{id:"f179",name:"豪奢な装飾のティーテーブル",type:"テーブル",cat:"furniture",targets:["s157"]},{id:"f180",name:"豪華な姿見",type:"小物",cat:"furniture",targets:["s055"]},{id:"f181",name:"販売用の机",type:"テーブル",cat:"furniture",targets:["s083","s171"]},{id:"f182",name:"軽快な譜面台",type:"小物",cat:"furniture",targets:["s082"]},{id:"f183",name:"輸送船の窓",type:"壁の装飾",cat:"decoration",targets:["s011"]},{id:"f184",name:"過ぎ去りし思い出",type:"小物",cat:"furniture",targets:["s047"]},{id:"f185",name:"鉄製引き戸ロッカー",type:"クローゼット",cat:"furniture",targets:["s249"]},{id:"f186",name:"陰陽部室の座卓",type:"テーブル",cat:"furniture",targets:["s102"]},{id:"f187",name:"魔法の絨毯＆サーキュレーター",type:"小物",cat:"furniture",targets:["s030"]},
];

const getSeries = (name) => SERIES_MAP[name] || "";
const SERIES_ORDER=["その他","ノーマル家具","モモフレンズのカフェ","ゼリーズゲーセン","バレンタイン","サマーリゾート","ハロウィーンカフェ","伝統的な温泉郷","お正月","ミリタリーアウトドア","ビーチサイド","大運動会","アビドス教室","ゲーム開発部","サンシャインリゾート","デパート","ゲヘナパーティー","トリニティ教室","DJパーティー会場","百鬼夜行","ミレニアムタワーラウンジ","ハイランダー列車","ティーパーティー","ワイルドハントキャンパス","輸送船"];
const seriesIdx = (name) => { const s=getSeries(name)||"その他"; const i=SERIES_ORDER.indexOf(s); return i>=0?i:0; };
const FURN_TYPES = [...new Set(INIT_FURNITURE.map(f=>f.type))].sort((a,b)=>a.localeCompare(b,"ja"));
const STUDENT_MAP = Object.fromEntries(INIT_STUDENTS.map(s => [s.id, s]));
const FURN_MAP = Object.fromEntries(INIT_FURNITURE.map(f => [f.id, f]));

// ========== Storage ==========
const SK = "ba-mgr-v5";
const initState = (prev) => ({
  version: 5,
  students: Object.fromEntries(INIT_STUDENTS.map(s => {
    const p = prev?.students?.[s.id];
    return [s.id, { owned: p?.owned ?? false, star: p?.star ?? s.star, bond: p?.bond ?? 1, hasEx: p?.hasEx ?? s.hasEx }];
  })),
  furniture: Object.fromEntries(INIT_FURNITURE.map(f => {
    const p = prev?.furniture?.[f.id];
    return [f.id, { owned: p?.owned ?? false, room: p?.room ?? 0 }];
  })),
  furnitureOrder: prev?.furnitureOrder || INIT_FURNITURE.map(f => f.id),
  customStudents: prev?.customStudents || [],
  customFurniture: prev?.customFurniture || [],
  masterEdits: prev?.masterEdits || { furniture: {}, students: {}, series: {} },
});

// ========== Styles ==========
const C = { bg:"#1a1b2e",card:"#252742",accent:"#4fc3f7",accentDim:"#2a6f8a",gold:"#ffd54f",text:"#e8eaf6",textDim:"#9e9eaf",border:"#3a3c5a",owned:"#2e7d32",room1:"#e65100",room2:"#6a1b9a",roomBoth:"#1565c0",danger:"#ef5350",catFurn:"#4a6741",catDeco:"#6a4176",amber:"#ffb74d",purple:"#ce93d8" };
const isInRoom = (r, t) => r === 3 || r === t;
const roomColor = (r) => r===3?C.roomBoth:r===2?C.room2:r===1?C.room1:C.border;
const roomLabel = (r) => r===3?"R1&R2":r===2?"R2":r===1?"R1":"未設置";
const btn = (on, color) => ({ padding:"5px 10px",border:"none",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600,background:on?(color||C.accent):C.card,color:on?"#000":C.textDim,transition:"all .2s",whiteSpace:"nowrap" });

export default function App() {
  const [state, setState] = useState(() => initState());
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [furniCat, setFurniCat] = useState("all");
  const [furniType, setFurniType] = useState("all");
  const [furniSort, setFurniSort] = useState("user");
  const [studentSort, setStudentSort] = useState("name-asc");
  const [bondFilter, setBondFilter] = useState("all");
  const [motionFilter, setMotionFilter] = useState("all");
  const [dragId, setDragId] = useState(null);
  const [roomMode, setRoomMode] = useState("room");
  const [roomSearch, setRoomSearch] = useState("");
  const [showIO, setShowIO] = useState(false);
  const [importText, setImportText] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [addMode, setAddMode] = useState(null);
  const [addForm, setAddForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [stateBackup, setStateBackup] = useState(null);
  const [hlScope, setHlScope] = useState("all");
  const [hlThreshold, setHlThreshold] = useState("cap");
  const [editFurnId, setEditFurnId] = useState(null);
  const [editStudentId, setEditStudentId] = useState(null);
  const [editDraft, setEditDraft] = useState({});

  // Load
  useEffect(() => {
    let c = false;
    const t = setTimeout(() => { if (!c) setLoaded(true); }, 2000);
    (async () => {
      try { if (window.storage) { const r = await window.storage.get(SK); if (r?.value && !c) { const d = JSON.parse(r.value); setState(initState(d)); }}} catch {}
      if (!c) { clearTimeout(t); setLoaded(true); }
    })();
    return () => { c = true; clearTimeout(t); };
  }, []);

  // Save — suppress in editMode (manual save on exit)
  const saveNow = useCallback(() => { try { if (window.storage) window.storage.set(SK, JSON.stringify(state)); } catch {} }, [state]);
  useEffect(() => { if (!loaded || editMode) return; saveNow(); }, [state, loaded, editMode, saveNow]);

  const enterEdit = () => { setStateBackup(JSON.parse(JSON.stringify(state))); setEditMode(true); setEditFurnId(null); setEditStudentId(null); };
  const saveEdit = () => { setEditMode(false); setStateBackup(null); setEditFurnId(null); setEditStudentId(null); };
  const cancelEdit = () => { if(stateBackup) setState(stateBackup); setEditMode(false); setStateBackup(null); setEditFurnId(null); setEditStudentId(null); };

  // Master data edit helpers
  const startEditFurn = (f) => {
    setEditFurnId(f.id); setEditStudentId(null);
    setEditDraft({ name: eFurnName(f), series: eFurnSeries(f), targets: eFurnTargets(f).map(sid=>eStudentName(allStudentMap[sid]||{name:sid})).join(", ") });
  };
  const applyEditFurn = (fid) => {
    const targetIds = editDraft.targets.split(",").map(s=>s.trim()).filter(Boolean).map(tname=>allStudents.find(s=>eStudentName(s)===tname)?.id).filter(Boolean);
    setState(prev => ({...prev, masterEdits: {...(prev.masterEdits||{}), furniture:{...(prev.masterEdits?.furniture||{}), [fid]:{name:editDraft.name.trim(), targets:targetIds}}, series:{...(prev.masterEdits?.series||{}), [editDraft.name.trim()]:editDraft.series.trim()} }}));
    setEditFurnId(null);
  };
  const startEditStudent = (s) => {
    setEditStudentId(s.id); setEditFurnId(null);
    setEditDraft({ name: eStudentName(s) });
  };
  const applyEditStudent = (sid) => {
    setState(prev => ({...prev, masterEdits: {...(prev.masterEdits||{}), students:{...(prev.masterEdits?.students||{}), [sid]:{name:editDraft.name.trim()}} }}));
    setEditStudentId(null);
  };

  const upd = useCallback((path, val) => setState(prev => {
    const n = JSON.parse(JSON.stringify(prev)); const k = path.split("."); let o = n;
    for (let i = 0; i < k.length - 1; i++) o = o[k[i]]; o[k[k.length - 1]] = val; return n;
  }), []);

  // ---- Helpers ----
  const gss = useCallback((sid) => state.students[sid] || { owned:false, star:STUDENT_MAP[sid]?.star||3, bond:1, hasEx:STUDENT_MAP[sid]?.hasEx||false }, [state.students]);
  const gfs = useCallback((fid) => state.furniture[fid] || { owned:false, room:0 }, [state.furniture]);
  const tso = (sid) => { const c=gss(sid); upd(`students.${sid}`,{...c,owned:!c.owned}); };
  const ssr = (sid,star) => { const c=gss(sid); upd(`students.${sid}`,{...c,star,bond:Math.min(c.bond,getBondCap(star))}); };
  const ssb = (sid,bond) => { const c=gss(sid); upd(`students.${sid}`,{...c,bond:Math.max(1,Math.min(bond,getBondCap(c.star)))}); };
  const tex = (sid) => { const c=gss(sid); upd(`students.${sid}`,{...c,hasEx:!c.hasEx}); };
  const tfo = (fid) => { const c=gfs(fid); upd(`furniture.${fid}`,{...c,owned:!c.owned}); };
  const sfr = (fid,r) => { const c=gfs(fid); upd(`furniture.${fid}`,{...c,room:r}); };
  const toggleRoom = (fid,tr) => { const r=gfs(fid).room; sfr(fid,r===3?(tr===1?2:1):r===tr?0:r===0?tr:3); };

  const allStudents = useMemo(() => [...INIT_STUDENTS, ...(state.customStudents||[])], [state.customStudents]);
  const allFurniture = useMemo(() => [...INIT_FURNITURE, ...(state.customFurniture||[])], [state.customFurniture]);
  const allStudentMap = useMemo(() => Object.fromEntries(allStudents.map(s=>[s.id,s])), [allStudents]);
  const allFurnMap = useMemo(() => Object.fromEntries(allFurniture.map(f=>[f.id,f])), [allFurniture]);

  // Effective name/targets with masterEdits overlay
  const me = state.masterEdits || { furniture:{}, students:{}, series:{} };
  const eFurnName = (f) => me.furniture?.[f.id]?.name || f.name;
  const eFurnTargets = (f) => me.furniture?.[f.id]?.targets || f.targets;
  const eFurnSeries = (f) => { const n=eFurnName(f); return me.series?.[n] ?? (SERIES_MAP[n] || SERIES_MAP[f.name] || ""); };
  const eStudentName = (s) => me.students?.[s.id]?.name || s.name;

  // Students targeted by any motion furniture (using effective targets)
  const motionStudentIds = useMemo(() => { const s=new Set(); allFurniture.forEach(f=>(me.furniture?.[f.id]?.targets||f.targets).forEach(sid=>s.add(sid))); return s; }, [allFurniture, me.furniture]);

  // Highlight: configurable scope and threshold for room tab
  const furnHighlight = (f) => {
    const targets = eFurnTargets(f);
    if(targets.length===0) return false;
    const ot = targets.filter(sid=>gss(sid).owned);
    if(ot.length===0) return false;
    const check = (sid) => {
      const s=gss(sid);
      if(hlThreshold==="cap") return s.bond>=getBondCap(s.star);
      return s.hasEx ? s.bond>=20 : s.bond>=9;
    };
    return hlScope==="all" ? ot.every(check) : ot.some(check);
  };

  // Sorted/filtered furniture
  const eSeriesIdx = (f) => { const s=eFurnSeries(f)||"その他"; const i=SERIES_ORDER.indexOf(s); return i>=0?i:0; };
  const filteredFurniture = useMemo(() => {
    const order = state.furnitureOrder || allFurniture.map(f=>f.id);
    let list = order.filter(id=>allFurnMap[id]).map(id=>allFurnMap[id]);
    if (furniCat !== "all") list = list.filter(f=>f.cat===furniCat);
    if (furniType !== "all") list = list.filter(f=>f.type===furniType);
    if (search) { const q=search.toLowerCase(); list=list.filter(f=>eFurnName(f).toLowerCase().includes(q)||eFurnTargets(f).some(sid=>(eStudentName(allStudentMap[sid]||{name:sid})).toLowerCase().includes(q))); }
    if (furniSort === "name") list = [...list].sort((a,b)=>eFurnName(a).localeCompare(eFurnName(b),"ja"));
    else if (furniSort === "series") list = [...list].sort((a,b)=>eSeriesIdx(a)-eSeriesIdx(b)||eFurnName(a).localeCompare(eFurnName(b),"ja"));
    return list;
  }, [furniCat, furniType, search, furniSort, state.furnitureOrder, allFurniture, allFurnMap, allStudentMap, me]);

  // Sorted/filtered students for bond tab
  const sortedStudents = useMemo(() => {
    let list = [...allStudents];
    if (search) { const q=search.toLowerCase(); list=list.filter(s=>eStudentName(s).toLowerCase().includes(q)); }
    if (bondFilter === "owned") list = list.filter(s=>gss(s.id).owned);
    else if (bondFilter === "notOwned") list = list.filter(s=>!gss(s.id).owned);
    if (motionFilter === "hasMotion") list = list.filter(s=>motionStudentIds.has(s.id));
    else if (motionFilter === "noMotion") list = list.filter(s=>!motionStudentIds.has(s.id));
    const [key,dir] = studentSort.split("-");
    list.sort((a,b)=>{ if(key==="name"){const c=eStudentName(a).localeCompare(eStudentName(b),"ja");return dir==="asc"?c:-c;} const sa=gss(a.id).star,sb=gss(b.id).star; if(sa!==sb)return dir==="asc"?sa-sb:sb-sa; return eStudentName(a).localeCompare(eStudentName(b),"ja"); });
    return list;
  }, [search, studentSort, bondFilter, motionFilter, state.students, allStudents, motionStudentIds, me]);

  // Stats
  const stats = useMemo(() => {
    const of=allFurniture.filter(f=>gfs(f.id).owned).length;
    const r1=allFurniture.filter(f=>{const r=gfs(f.id).room;return r===1||r===3;}).length;
    const r2=allFurniture.filter(f=>{const r=gfs(f.id).room;return r===2||r===3;}).length;
    return {of,r1,r2,tf:allFurniture.length};
  }, [state.furniture, allFurniture]);

  // Add custom student/furniture
  const addCustomStudent = () => {
    const name = addForm.name?.trim();
    if (!name) return;
    const id = "cs_" + Date.now();
    setState(prev => ({
      ...prev,
      customStudents: [...(prev.customStudents||[]), {id,name,star:Number(addForm.star)||3,hasEx:!!addForm.hasEx}],
      students: {...prev.students, [id]:{owned:false,star:Number(addForm.star)||3,bond:1,hasEx:!!addForm.hasEx}}
    }));
    setAddForm({}); setAddMode(null);
  };
  const addCustomFurniture = () => {
    const name = addForm.name?.trim();
    if (!name) return;
    const id = "cf_" + Date.now();
    const targets = (addForm.targets||"").split(",").map(s=>s.trim()).filter(Boolean);
    const targetIds = targets.map(tname => allStudents.find(s=>s.name===tname)?.id).filter(Boolean);
    setState(prev => ({
      ...prev,
      customFurniture: [...(prev.customFurniture||[]), {id,name,type:addForm.type||"小物",cat:addForm.cat||"furniture",targets:targetIds}],
      furniture: {...prev.furniture, [id]:{owned:false,room:0}},
      furnitureOrder: [...(prev.furnitureOrder||[]),id]
    }));
    setAddForm({}); setAddMode(null);
  };
  const deleteCustomStudent = (id) => setState(prev => ({...prev, customStudents:(prev.customStudents||[]).filter(s=>s.id!==id)}));
  const deleteCustomFurniture = (id) => setState(prev => ({...prev, customFurniture:(prev.customFurniture||[]).filter(f=>f.id!==id), furnitureOrder:(prev.furnitureOrder||[]).filter(fid=>fid!==id)}));

  const exportJson = useMemo(() => showIO ? JSON.stringify(state,null,2) : "", [showIO,state]);
  const doImport = () => { try { const d=JSON.parse(importText); if(d.students&&d.furniture){setState(initState(d));setImportText("");setShowIO(false);}else{alert("無効なデータ");}} catch{alert("JSON形式エラー");} };
  const doReset = () => { const f=initState(); setState(f); try{if(window.storage)window.storage.set(SK,JSON.stringify(f));}catch{} setConfirmReset(false); };

  const tabs = ["所持状況","ルーム設置","絆ランク","データ管理"];
  const sortOpts = [{v:"name-asc",l:"名前↑"},{v:"name-desc",l:"名前↓"},{v:"star-asc",l:"★↑"},{v:"star-desc",l:"★↓"}];

  // Drag handlers
  const onDS = (fid) => setDragId(fid);
  const onDO = (e) => e.preventDefault();
  const onDE = () => setDragId(null);
  const onDrop = (tid) => { if(!dragId){return;} if(dragId===tid){setDragId(null);return;} setState(prev=>{const o=[...(prev.furnitureOrder||allFurniture.map(f=>f.id))];const fi=o.indexOf(dragId),ti=o.indexOf(tid);if(fi<0||ti<0)return prev;o.splice(fi,1);o.splice(ti,0,dragId);return{...prev,furnitureOrder:o};}); setDragId(null); };

  // Room search filter
  const roomSearchFilter = (f) => {
    if (!roomSearch) return true;
    const q = roomSearch.toLowerCase();
    return eFurnName(f).toLowerCase().includes(q) || eFurnTargets(f).some(sid=>(eStudentName(allStudentMap[sid]||{name:""}) ).toLowerCase().includes(q));
  };

  // Furniture card for room tab
  const FurnRoomCard = ({f, border, showSelect}) => {
    const fs = gfs(f.id);
    const hl = furnHighlight(f);
    const tNames = eFurnTargets(f).map(sid => { const ss=gss(sid); const sd=allStudentMap[sid]; return sd?`${eStudentName(sd)}(★${ss.star} 絆${ss.bond})`:"?"; }).join(", ");
    const hlBg = hl ? `${C.gold}22` : C.card;
    const hlBorder = hl ? C.gold : border;
    return (
      <div style={{background:hlBg,borderRadius:8,padding:"6px 10px",marginBottom:3,border:`2px solid ${hlBorder}`,boxShadow:hl?`0 0 8px ${C.gold}44`:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600}}>{eFurnName(f)} {fs.room===3&&<span style={{fontSize:9,background:C.roomBoth,color:"#fff",padding:"1px 4px",borderRadius:3,marginLeft:4}}>両方</span>}</div>
            <div style={{fontSize:10,color:hl?C.gold:C.textDim}}>{tNames}</div>
          </div>
          {showSelect && <select value={fs.room} onChange={e=>sfr(f.id,Number(e.target.value))} style={{background:C.card,color:C.text,border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 5px",fontSize:11}}>
            <option value={0}>未設置</option><option value={1}>ルーム1</option><option value={2}>ルーム2</option><option value={3}>両方(1&2)</option>
          </select>}
        </div>
      </div>
    );
  };

  if (!loaded) return <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:C.textDim}}>読み込み中...</div>;

  return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"'Segoe UI',sans-serif",maxWidth:900,margin:"0 auto",padding:"8px 12px"}}>
      <h2 style={{textAlign:"center",margin:"8px 0",fontSize:18,background:"linear-gradient(135deg,#4fc3f7,#7c4dff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>ブルアカ モーション家具マネージャー</h2>
      <div style={{textAlign:"center",fontSize:11,color:C.textDim,marginBottom:8}}>家具 {stats.of}/{stats.tf} | R1:{stats.r1} R2:{stats.r2} | 生徒 {allStudents.length}名</div>

      <div style={{display:"flex",gap:4,marginBottom:8}}>{tabs.map((t,i)=><button key={i} onClick={()=>{if(editMode){if(!confirm("編集中です。変更を破棄してタブを切り替えますか？")){return;}cancelEdit();}setTab(i);}} style={{flex:1,padding:"8px 0",border:"none",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:600,background:tab===i?C.accent:C.card,color:tab===i?"#000":C.textDim}}>{t}</button>)}</div>

      {editMode && <div style={{background:"#ff980033",border:"1px solid #ff9800",borderRadius:6,padding:"6px 12px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:12,fontWeight:600,color:"#ffb74d"}}>📝 編集モード</span>
        <div style={{display:"flex",gap:4}}>
          <button onClick={saveEdit} style={{padding:"4px 10px",border:"none",borderRadius:4,background:"#66bb6a",color:"#000",fontSize:11,fontWeight:700,cursor:"pointer"}}>💾 保存</button>
          <button onClick={cancelEdit} style={{padding:"4px 10px",border:"none",borderRadius:4,background:C.danger,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>✕ 取消</button>
        </div>
      </div>}

      {tab<3 && <input value={tab===1?roomSearch:search} onChange={e=>tab===1?setRoomSearch(e.target.value):setSearch(e.target.value)} placeholder="検索(家具名・生徒名)..." style={{width:"100%",padding:"8px 12px",boxSizing:"border-box",borderRadius:6,border:`1px solid ${C.border}`,background:C.card,color:C.text,fontSize:13,marginBottom:8,outline:"none"}} />}

      {/* ===== Tab 0: 所持状況 ===== */}
      {tab===0 && <div>
        {/* Category filter */}
        <div style={{display:"flex",gap:4,marginBottom:4}}>
          {[["all",`全て(${allFurniture.length})`],["furniture",`家具(${allFurniture.filter(f=>f.cat==="furniture").length})`],["decoration",`装飾(${allFurniture.filter(f=>f.cat==="decoration").length})`]].map(([k,l])=>
            <button key={k} onClick={()=>setFurniCat(k)} style={btn(furniCat===k,k==="furniture"?C.catFurn:k==="decoration"?C.catDeco:C.accentDim)}>{l}</button>
          )}
        </div>
        {/* Type filter */}
        <div style={{display:"flex",gap:3,marginBottom:4,flexWrap:"wrap"}}>
          <button onClick={()=>setFurniType("all")} style={btn(furniType==="all")}>種別:全て</button>
          {FURN_TYPES.map(t=><button key={t} onClick={()=>setFurniType(t)} style={btn(furniType===t)}>{t}</button>)}
        </div>
        {/* Sort */}
        <div style={{display:"flex",gap:3,marginBottom:6,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:C.textDim}}>並替:</span>
          {[["user","ユーザー設定"],["name","名前"],["series","セット"]].map(([k,l])=>
            <button key={k} onClick={()=>setFurniSort(k)} style={btn(furniSort===k)}>{l}</button>
          )}
          <span style={{flex:1}} />
          {!editMode ? <button onClick={enterEdit} style={{padding:"5px 12px",border:"none",borderRadius:6,background:C.accentDim,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>📝 編集</button>
          : <>{" "}<button onClick={saveEdit} style={{padding:"5px 12px",border:"none",borderRadius:6,background:"#66bb6a",color:"#000",fontSize:11,fontWeight:700,cursor:"pointer"}}>💾 保存</button>
            <button onClick={cancelEdit} style={{padding:"5px 12px",border:"none",borderRadius:6,background:C.danger,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>✕ 取消</button></>}
        </div>

        {filteredFurniture.map((f,i) => {
          const fs=gfs(f.id); const fn=eFurnName(f); const ft=eFurnTargets(f);
          const tNames=ft.map(sid=>eStudentName(allStudentMap[sid]||{name:sid})).join(", ");
          const series=eFurnSeries(f); const isCustom=f.id.startsWith("cf_");
          const showSeriesHeader = furniSort==="series" && (i===0 || eSeriesIdx(filteredFurniture[i-1])!==eSeriesIdx(f));
          const isEditing = editMode && editFurnId===f.id;
          return (<div key={f.id}>
            {showSeriesHeader && <div style={{fontSize:11,fontWeight:700,color:C.accent,padding:"6px 0 2px",borderBottom:`1px solid ${C.border}`,marginBottom:4}}>{series||"その他"}</div>}
            <div draggable={furniSort==="user"&&!isEditing} onDragStart={()=>onDS(f.id)} onDragOver={onDO} onDrop={()=>onDrop(f.id)} onDragEnd={onDE}
              style={{background:isEditing?"#2a3050":dragId===f.id?"#3a3c6a":C.card,borderRadius:8,padding:"7px 10px",marginBottom:3,border:`1px solid ${isEditing?"#ff9800":fs.owned?C.owned:C.border}`,cursor:furniSort==="user"&&!isEditing?"grab":"default",opacity:dragId===f.id?0.5:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14,cursor:"pointer",userSelect:"none"}} onClick={()=>tfo(f.id)}>{fs.owned?"✅":"⬜"}</span>
                <div style={{flex:1,minWidth:0}}>
                  {!isEditing ? <>
                    <div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{fn}</div>
                    <div style={{fontSize:10,color:C.textDim}}>
                      <span style={{background:f.cat==="decoration"?C.catDeco:C.catFurn,padding:"1px 4px",borderRadius:3,marginRight:3,color:"#fff",fontSize:9}}>{f.type}</span>
                      {series&&<span style={{padding:"1px 4px",borderRadius:3,marginRight:3,color:C.accent,fontSize:9,border:`1px solid ${C.accent}33`}}>{series}</span>}
                      {tNames}
                    </div>
                  </> : <div style={{display:"flex",flexDirection:"column",gap:3}}>
                    <div style={{display:"flex",gap:4,alignItems:"center"}}>
                      <span style={{fontSize:10,color:C.textDim,width:40}}>名前</span>
                      <input value={editDraft.name||""} onChange={e=>setEditDraft({...editDraft,name:e.target.value})} style={{flex:1,padding:"3px 6px",borderRadius:4,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:11,outline:"none"}} />
                    </div>
                    <div style={{display:"flex",gap:4,alignItems:"center"}}>
                      <span style={{fontSize:10,color:C.textDim,width:40}}>シリーズ</span>
                      <input value={editDraft.series||""} onChange={e=>setEditDraft({...editDraft,series:e.target.value})} placeholder="(なし)" style={{flex:1,padding:"3px 6px",borderRadius:4,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:11,outline:"none"}} />
                    </div>
                    <div style={{display:"flex",gap:4,alignItems:"center"}}>
                      <span style={{fontSize:10,color:C.textDim,width:40}}>対象</span>
                      <input value={editDraft.targets||""} onChange={e=>setEditDraft({...editDraft,targets:e.target.value})} placeholder="生徒名(カンマ区切り)" style={{flex:1,padding:"3px 6px",borderRadius:4,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:11,outline:"none"}} />
                    </div>
                    <div style={{display:"flex",gap:3,justifyContent:"flex-end"}}>
                      <button onClick={()=>applyEditFurn(f.id)} style={{padding:"3px 10px",border:"none",borderRadius:4,background:"#66bb6a",color:"#000",fontSize:10,fontWeight:700,cursor:"pointer"}}>適用</button>
                      <button onClick={()=>setEditFurnId(null)} style={{padding:"3px 10px",border:"none",borderRadius:4,background:C.card,color:C.textDim,fontSize:10,cursor:"pointer"}}>閉じる</button>
                    </div>
                  </div>}
                </div>
                {editMode&&!isEditing&&<span onClick={()=>startEditFurn(f)} style={{cursor:"pointer",fontSize:11,color:"#ffb74d",padding:"2px 6px",borderRadius:4,border:"1px solid #ff980055"}}>✏️</span>}
                {isCustom&&<span onClick={()=>deleteCustomFurniture(f.id)} style={{cursor:"pointer",fontSize:12,color:C.danger}}>✕</span>}
                {fs.room>0&&<span style={{fontSize:9,padding:"2px 5px",borderRadius:4,background:roomColor(fs.room),color:"#fff",fontWeight:700}}>{roomLabel(fs.room)}</span>}
                {furniSort==="user"&&!isEditing&&<span style={{fontSize:14,color:C.textDim,cursor:"grab"}}>⠿</span>}
              </div>
            </div>
          </div>);
        })}
      </div>}

      {/* ===== Tab 1: ルーム設置 ===== */}
      {tab===1 && <div>
        <div style={{display:"flex",gap:4,marginBottom:6}}>
          <button onClick={()=>setRoomMode("room")} style={btn(roomMode==="room")}>ルーム表示</button>
          <button onClick={()=>setRoomMode("furniture")} style={btn(roomMode==="furniture")}>家具表示</button>
        </div>
        <div style={{background:C.card,borderRadius:6,padding:"6px 10px",marginBottom:8,display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:C.gold,fontWeight:600}}>🏅HL:</span>
          <span style={{fontSize:10,color:C.textDim}}>所持生徒</span>
          {[["all","全員が"],["any","誰かが"]].map(([k,l])=>
            <button key={k} onClick={()=>setHlScope(k)} style={btn(hlScope===k,C.gold)}>{l}</button>
          )}
          <span style={{fontSize:10,color:C.textDim}}>絆</span>
          {[["cap","上限"],["ex920","EX有20/EX無9"]].map(([k,l])=>
            <button key={k} onClick={()=>setHlThreshold(k)} style={btn(hlThreshold===k,C.gold)}>{l}</button>
          )}
          <span style={{fontSize:10,color:C.textDim}}>に達成</span>
        </div>

        {roomMode==="room" ? <div>
          {[1,2].map(rn => {
            const owned = allFurniture.filter(f=>gfs(f.id).owned&&roomSearchFilter(f));
            const inRoom = owned.filter(f=>isInRoom(gfs(f.id).room,rn));
            return <div key={rn} style={{marginBottom:20}}>
              <h3 style={{fontSize:15,color:rn===1?C.room1:C.room2,marginBottom:4}}>ルーム {rn} <span style={{fontSize:11,fontWeight:400,color:C.textDim}}>({inRoom.length}個)</span></h3>
              {owned.length===0&&<div style={{fontSize:12,color:C.textDim,padding:8}}>所持家具なし</div>}
              {owned.map(f => {
                const fs=gfs(f.id); const checked=isInRoom(fs.room,rn);
                const hl = furnHighlight(f);
                const tNames=eFurnTargets(f).map(sid=>{const ss=gss(sid);return allStudentMap[sid]?`${eStudentName(allStudentMap[sid])}(★${ss.star} 絆${ss.bond})`:"?";}).join(", ");
                return <div key={f.id} style={{background:hl?`${C.gold}22`:checked?`${roomColor(rn)}15`:C.card,borderRadius:8,padding:"5px 10px",marginBottom:2,border:`1px solid ${hl?C.gold:checked?roomColor(rn):C.border}`,boxShadow:hl?`0 0 6px ${C.gold}33`:"none"}}>
                  <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                    <input type="checkbox" checked={checked} onChange={()=>toggleRoom(f.id,rn)} style={{accentColor:roomColor(rn),width:15,height:15}} />
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11,fontWeight:600}}>{eFurnName(f)} {fs.room===3&&<span style={{fontSize:9,background:C.roomBoth,color:"#fff",padding:"1px 3px",borderRadius:3}}>両方</span>}</div>
                      <div style={{fontSize:10,color:hl?C.gold:C.textDim}}>{tNames}</div>
                    </div>
                  </label>
                </div>;
              })}
            </div>;
          })}
        </div> : <div>
          {[1,2].map(rn => {
            const rf = allFurniture.filter(f=>isInRoom(gfs(f.id).room,rn)&&roomSearchFilter(f));
            return <div key={rn} style={{marginBottom:16}}>
              <h3 style={{fontSize:14,color:rn===1?C.room1:C.room2,marginBottom:6}}>ルーム {rn} ({rf.length}個)</h3>
              {rf.length===0&&<div style={{fontSize:12,color:C.textDim,padding:8}}>設置なし</div>}
              {rf.map(f=><FurnRoomCard key={f.id} f={f} border={roomColor(rn)} showSelect />)}
            </div>;
          })}
          <h3 style={{fontSize:14,color:C.textDim,marginBottom:6}}>未設置(所持済み)</h3>
          {allFurniture.filter(f=>gfs(f.id).owned&&gfs(f.id).room===0&&roomSearchFilter(f)).map(f=><FurnRoomCard key={f.id} f={f} border={C.border} showSelect />)}
        </div>}
      </div>}

      {/* ===== Tab 2: 絆ランク ===== */}
      {tab===2 && <div>
        <div style={{display:"flex",gap:3,marginBottom:4,flexWrap:"wrap",alignItems:"center"}}>
          {sortOpts.map(o=><button key={o.v} onClick={()=>setStudentSort(o.v)} style={btn(studentSort===o.v)}>{o.l}</button>)}
          <span style={{flex:1}} />
          {!editMode ? <button onClick={enterEdit} style={{padding:"5px 12px",border:"none",borderRadius:6,background:C.accentDim,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>📝 編集</button>
          : <>{" "}<button onClick={saveEdit} style={{padding:"5px 12px",border:"none",borderRadius:6,background:"#66bb6a",color:"#000",fontSize:11,fontWeight:700,cursor:"pointer"}}>💾 保存</button>
            <button onClick={cancelEdit} style={{padding:"5px 12px",border:"none",borderRadius:6,background:C.danger,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>✕ 取消</button></>}
        </div>
        <div style={{display:"flex",gap:3,marginBottom:4,flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:C.textDim,lineHeight:"26px"}}>絞込:</span>
          {[["all","全て"],["owned","所持"],["notOwned","未所持"]].map(([k,l])=>
            <button key={k} onClick={()=>setBondFilter(k)} style={btn(bondFilter===k)}>{l}</button>
          )}
          <span style={{fontSize:10,color:C.textDim,lineHeight:"26px",marginLeft:6}}>家具:</span>
          {[["all","全て"],["hasMotion","有"],["noMotion","無"]].map(([k,l])=>
            <button key={k} onClick={()=>setMotionFilter(k)} style={btn(motionFilter===k)}>{l}</button>
          )}
        </div>
        <div style={{fontSize:10,color:C.textDim,marginBottom:6,padding:"3px 8px",background:C.card,borderRadius:6,lineHeight:1.6}}>
          <span style={{color:C.amber}}>■</span>EX無&絆≥9 <span style={{color:C.purple}}>■</span>EX有&絆≥20 <span style={{color:C.gold}}>■</span>絆MAX ▸EXタップ切替
        </div>

        {sortedStudents.map(s => {
          const ss=gss(s.id); const cap=getBondCap(ss.star); const isMax=ss.bond>=cap;
          const hasEx=ss.hasEx; const relFurn=allFurniture.filter(f=>eFurnTargets(f).includes(s.id));
          const hlA=!hasEx&&ss.bond>=9&&!isMax; const hlP=hasEx&&ss.bond>=20&&!isMax;
          const hlBg=isMax?`${C.gold}18`:hlP?`${C.purple}33`:hlA?`${C.amber}28`:C.card;
          const hlB=isMax?C.gold:hlP?C.purple:hlA?C.amber:C.border;
          const isCustom=s.id.startsWith("cs_");
          const sn=eStudentName(s);
          const isEditingS = editMode && editStudentId===s.id;
          return <div key={s.id} style={{background:isEditingS?"#2a3050":hlBg,borderRadius:8,padding:"7px 10px",marginBottom:3,border:`1px solid ${isEditingS?"#ff9800":hlB}`,boxShadow:isMax?`0 0 6px ${C.gold}33`:hlP||hlA?`0 0 6px ${hlB}33`:"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:14,cursor:"pointer"}} onClick={()=>tso(s.id)}>{ss.owned?"✅":"⬜"}</span>
              <div style={{flex:1,minWidth:0}}>
                {!isEditingS ? <div style={{fontSize:12,fontWeight:600,display:"flex",alignItems:"center",flexWrap:"wrap",gap:3}}>
                  {sn} <span style={{fontSize:10,color:C.gold}}>{"★".repeat(ss.star)}</span>
                  <span onClick={()=>tex(s.id)} style={{fontSize:9,padding:"1px 4px",borderRadius:4,fontWeight:700,cursor:"pointer",userSelect:"none",background:hasEx?"#ce93d8":"#555",color:hasEx?"#1a1a2e":"#999",border:hasEx?"1px solid #ce93d8":"1px dashed #777"}}>{hasEx?"EX有":"EX無"}</span>
                  {hlA&&<span style={{fontSize:9,color:C.amber}}>⚠絆{ss.bond}</span>}
                  {hlP&&<span style={{fontSize:9,color:C.purple}}>💎絆{ss.bond}</span>}
                  {isCustom&&<span onClick={()=>deleteCustomStudent(s.id)} style={{cursor:"pointer",fontSize:11,color:C.danger,marginLeft:4}}>✕削除</span>}
                  {editMode&&<span onClick={()=>startEditStudent(s)} style={{cursor:"pointer",fontSize:11,color:"#ffb74d",marginLeft:2,padding:"1px 5px",borderRadius:4,border:"1px solid #ff980055"}}>✏️</span>}
                </div> : <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
                  <input value={editDraft.name||""} onChange={e=>setEditDraft({...editDraft,name:e.target.value})} style={{flex:1,minWidth:100,padding:"3px 6px",borderRadius:4,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:11,outline:"none"}} />
                  <button onClick={()=>applyEditStudent(s.id)} style={{padding:"3px 8px",border:"none",borderRadius:4,background:"#66bb6a",color:"#000",fontSize:10,fontWeight:700,cursor:"pointer"}}>適用</button>
                  <button onClick={()=>setEditStudentId(null)} style={{padding:"3px 8px",border:"none",borderRadius:4,background:C.card,color:C.textDim,fontSize:10,cursor:"pointer"}}>閉じる</button>
                </div>}
                <div style={{fontSize:10,color:C.textDim}}>{relFurn.map(f=>eFurnName(f)).join(", ")}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5,marginTop:5}}>
              <div style={{display:"flex",gap:1}}>{[1,2,3,4,5].map(n=><span key={n} onClick={()=>ssr(s.id,n)} style={{cursor:"pointer",fontSize:13,color:n<=ss.star?C.gold:C.textDim,userSelect:"none"}}>★</span>)}</div>
              <span style={{fontSize:10,color:C.textDim}}>絆</span>
              <input type="range" min={1} max={cap} value={ss.bond} onChange={e=>ssb(s.id,Number(e.target.value))} style={{flex:1,accentColor:isMax?C.gold:C.accent}} />
              <input type="number" min={1} max={cap} value={ss.bond} onChange={e=>{const v=parseInt(e.target.value);if(!isNaN(v))ssb(s.id,v);}} style={{width:40,background:C.card,color:isMax?C.gold:C.text,border:`1px solid ${C.border}`,borderRadius:4,padding:"2px 4px",fontSize:11,textAlign:"right",outline:"none"}} />
              <span style={{fontSize:10,color:C.textDim}}>/{cap}</span>
            </div>
          </div>;
        })}
      </div>}

      {/* ===== Tab 3: データ管理 ===== */}
      {tab===3 && <div style={{padding:8}}>
        <div style={{background:C.card,borderRadius:8,padding:12,marginBottom:10}}>
          <h3 style={{fontSize:14,marginBottom:6}}>マスタデータ</h3>
          <div style={{fontSize:11,color:C.textDim,lineHeight:1.8}}>
            <div>生徒: {allStudents.length}名 (★3:{allStudents.filter(s=>s.star===3).length} ★2:{allStudents.filter(s=>s.star===2).length} ★1:{allStudents.filter(s=>s.star===1).length}) EX有:{allStudents.filter(s=>s.hasEx).length}名</div>
            <div>家具: {allFurniture.length}個 (家具:{allFurniture.filter(f=>f.cat==="furniture").length} 装飾:{allFurniture.filter(f=>f.cat==="decoration").length})</div>
            <div>カスタム: 生徒{(state.customStudents||[]).length}名 家具{(state.customFurniture||[]).length}個</div>
          </div>
        </div>

        {/* Add buttons */}
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          <button onClick={()=>{setAddMode(addMode==="student"?null:"student");setAddForm({star:3});}} style={{padding:"7px 14px",border:"none",borderRadius:6,background:addMode==="student"?"#66bb6a":C.accentDim,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ 生徒追加</button>
          <button onClick={()=>{setAddMode(addMode==="furniture"?null:"furniture");setAddForm({cat:"furniture",type:"小物"});}} style={{padding:"7px 14px",border:"none",borderRadius:6,background:addMode==="furniture"?"#66bb6a":C.accentDim,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ 家具追加</button>
        </div>

        {addMode==="student" && <div style={{background:C.card,borderRadius:8,padding:12,marginBottom:10}}>
          <div style={{fontSize:12,fontWeight:600,marginBottom:6}}>生徒追加</div>
          <input placeholder="名前" value={addForm.name||""} onChange={e=>setAddForm({...addForm,name:e.target.value})} style={{width:"100%",boxSizing:"border-box",padding:"6px 8px",borderRadius:4,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:12,marginBottom:4,outline:"none"}} />
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:11,color:C.textDim}}>★</span>
            <select value={addForm.star||3} onChange={e=>setAddForm({...addForm,star:Number(e.target.value)})} style={{background:C.bg,color:C.text,border:`1px solid ${C.border}`,borderRadius:4,padding:"4px 6px",fontSize:11}}>
              {[1,2,3].map(n=><option key={n} value={n}>★{n}</option>)}
            </select>
            <label style={{fontSize:11,color:C.textDim,cursor:"pointer"}}><input type="checkbox" checked={!!addForm.hasEx} onChange={e=>setAddForm({...addForm,hasEx:e.target.checked})} /> EX有</label>
          </div>
          <button onClick={addCustomStudent} style={{padding:"6px 16px",border:"none",borderRadius:6,background:"#66bb6a",color:"#000",fontSize:12,fontWeight:600,cursor:"pointer"}}>追加</button>
        </div>}

        {addMode==="furniture" && <div style={{background:C.card,borderRadius:8,padding:12,marginBottom:10}}>
          <div style={{fontSize:12,fontWeight:600,marginBottom:6}}>家具追加</div>
          <input placeholder="名前" value={addForm.name||""} onChange={e=>setAddForm({...addForm,name:e.target.value})} style={{width:"100%",boxSizing:"border-box",padding:"6px 8px",borderRadius:4,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:12,marginBottom:4,outline:"none"}} />
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
            <select value={addForm.cat||"furniture"} onChange={e=>setAddForm({...addForm,cat:e.target.value})} style={{background:C.bg,color:C.text,border:`1px solid ${C.border}`,borderRadius:4,padding:"4px",fontSize:11}}>
              <option value="furniture">家具</option><option value="decoration">装飾</option>
            </select>
            <select value={addForm.type||"小物"} onChange={e=>setAddForm({...addForm,type:e.target.value})} style={{background:C.bg,color:C.text,border:`1px solid ${C.border}`,borderRadius:4,padding:"4px",fontSize:11}}>
              {FURN_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <input placeholder="対象生徒名(カンマ区切り)" value={addForm.targets||""} onChange={e=>setAddForm({...addForm,targets:e.target.value})} style={{width:"100%",boxSizing:"border-box",padding:"6px 8px",borderRadius:4,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:11,marginBottom:6,outline:"none"}} />
          <button onClick={addCustomFurniture} style={{padding:"6px 16px",border:"none",borderRadius:6,background:"#66bb6a",color:"#000",fontSize:12,fontWeight:600,cursor:"pointer"}}>追加</button>
        </div>}

        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
          <button onClick={()=>{setShowIO(!showIO);setImportText("");}} style={{padding:"7px 14px",border:"none",borderRadius:6,background:C.accent,color:"#000",fontSize:12,fontWeight:600,cursor:"pointer"}}>{showIO?"閉じる":"エクスポート/インポート"}</button>
          {!confirmReset?<button onClick={()=>setConfirmReset(true)} style={{padding:"7px 14px",border:"none",borderRadius:6,background:C.danger,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>全データリセット</button>
          :<div style={{display:"flex",gap:4,alignItems:"center"}}><span style={{fontSize:11,color:C.danger,fontWeight:700}}>本当に？</span>
            <button onClick={doReset} style={{padding:"5px 12px",border:"none",borderRadius:6,background:C.danger,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>実行</button>
            <button onClick={()=>setConfirmReset(false)} style={{padding:"5px 12px",border:"none",borderRadius:6,background:C.card,color:C.textDim,fontSize:11,cursor:"pointer"}}>取消</button>
          </div>}
        </div>

        {showIO && <div style={{background:C.card,borderRadius:8,padding:12}}>
          <div style={{fontSize:12,color:C.accent,fontWeight:600,marginBottom:4}}>エクスポート</div>
          <textarea readOnly value={exportJson} onFocus={e=>e.target.select()} style={{background:"#1e1e38",border:`1px solid ${C.border}`,borderRadius:6,color:"#81c784",padding:6,fontFamily:"monospace",fontSize:10,outline:"none",width:"100%",minHeight:50,resize:"vertical",boxSizing:"border-box",marginBottom:8}} />
          <div style={{fontSize:12,color:C.amber,fontWeight:600,marginBottom:4}}>インポート</div>
          <textarea value={importText} onChange={e=>setImportText(e.target.value)} placeholder="JSON貼り付け..." style={{background:"#1e1e38",border:`1px solid ${C.border}`,borderRadius:6,color:C.text,padding:6,fontFamily:"monospace",fontSize:10,outline:"none",width:"100%",minHeight:50,resize:"vertical",boxSizing:"border-box",marginBottom:6}} />
          <button onClick={doImport} style={{padding:"7px 14px",border:"none",borderRadius:6,background:"#66bb6a",color:"#000",fontSize:12,fontWeight:600,cursor:"pointer"}}>インポート実行</button>
        </div>}
      </div>}
    </div>
  );
}
