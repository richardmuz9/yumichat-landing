export interface EjuScore {
  total: number;
  japanese: number;
  math: number;
  science?: number;
}

export interface EjuScorePair {
  humanities: Omit<EjuScore, 'science'>;
  science: EjuScore;
}

export const ejuSummaryPrompt = `EJU戦略：
日本語370〜380点、数学200点、理科/総合190点が満点。
難関校の安全圏は合計650点以上。

📊【EJU構成】

- 日本語：370〜380点
- 理科 or 総合：190〜195点
- 数学：200点＋記述：50点

🧠【評価観点】

- 学力以外にも書類・面接・日本語運用力・熱意が重視される。
- 二次試験重視の大学はEJU配点が低め。
- 基礎問題優先、「基礎を落とさないこと」が最重要。
- EJU得点率 ≒ 共通テスト大学ボーダー（80〜90%が合格圏）。

※得点はあくまで目安。出願の際は学科・年度ごとに公式情報をご確認ください。`;

export const ejuScoreTable: Record<string, EjuScore> = {
  // National Universities
  'University of Tokyo': { total: 740, japanese: 370, math: 190, science: 180 },
  'Kyoto University': { total: 740, japanese: 370, math: 190, science: 180 },
  'Osaka University': { total: 680, japanese: 360, math: 160, science: 160 },
  'Tohoku University': { total: 680, japanese: 360, math: 160, science: 160 },
  'Nagoya University': { total: 680, japanese: 360, math: 160, science: 160 },
  'Hokkaido University': { total: 680, japanese: 360, math: 160, science: 160 },
  'Kyushu University': { total: 680, japanese: 360, math: 160, science: 160 },
  'Hitotsubashi University': { total: 740, japanese: 370, math: 190, science: 180 },
  'Tokyo Institute of Technology': { total: 640, japanese: 290, math: 180, science: 170 },
  'University of Tsukuba': { total: 680, japanese: 360, math: 160, science: 160 },
  'Kobe University': { total: 680, japanese: 360, math: 160, science: 160 },
  'Hiroshima University': { total: 630, japanese: 330, math: 150, science: 150 },
  'Chiba University': { total: 630, japanese: 330, math: 150, science: 150 },
  'Yokohama National University': { total: 660, japanese: 340, math: 160, science: 160 },
  'Tokyo University of Foreign Studies': { total: 680, japanese: 360, math: 160, science: 160 },
  'Ochanomizu University': { total: 630, japanese: 330, math: 150, science: 150 },
  'Kanazawa University': { total: 630, japanese: 330, math: 150, science: 150 },
  'Okayama University': { total: 630, japanese: 330, math: 150, science: 150 },
  'Nagoya Institute of Technology': { total: 630, japanese: 330, math: 150, science: 150 },
  'Tokyo University of Agriculture and Technology': { total: 630, japanese: 330, math: 150, science: 150 },
  'Shiga University of Medical Science': { total: 630, japanese: 330, math: 150, science: 150 },
  'Shinshu University': { total: 630, japanese: 330, math: 150, science: 150 },
  'Saitama University': { total: 630, japanese: 330, math: 150, science: 150 },
  'Niigata University': { total: 630, japanese: 330, math: 150, science: 150 },
  'Gifu University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Gunma University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Ibaraki University': { total: 560, japanese: 300, math: 130, science: 130 },
  'Iwate University': { total: 520, japanese: 260, math: 130, science: 130 },
  'Kagawa University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Kagoshima University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Kochi University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Kumamoto University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Mie University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Miyagi University of Education': { total: 560, japanese: 300, math: 130, science: 130 },
  'Muroran Institute of Technology': { total: 445, japanese: 225, math: 110, science: 110 },
  'Nagaoka University of Technology': { total: 600, japanese: 320, math: 140, science: 140 },
  'Nagasaki University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Nara Women\'s University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Obihiro University of Agriculture and Veterinary Medicine': { total: 600, japanese: 320, math: 140, science: 140 },
  'Oita University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Saga University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Shiga University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Shimane University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Shizuoka University': { total: 480, japanese: 220, math: 130, science: 130 },
  'Tokushima University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Tokyo Gakugei University': { total: 630, japanese: 330, math: 150, science: 150 },
  'Tokyo University of Marine Science and Technology': { total: 600, japanese: 320, math: 140, science: 140 },
  'Tokyo University of the Arts': { total: 600, japanese: 320, math: 140, science: 140 },
  'University of Fukui': { total: 600, japanese: 320, math: 140, science: 140 },
  'University of Miyazaki': { total: 600, japanese: 320, math: 140, science: 140 },
  'University of Toyama': { total: 600, japanese: 320, math: 140, science: 140 },
  'University of Yamanashi': { total: 600, japanese: 320, math: 140, science: 140 },
  'Utsunomiya University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Wakayama University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Yamagata University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Yamaguchi University': { total: 600, japanese: 320, math: 140, science: 140 },

  // Public Universities
  'Akita International University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Aichi Prefectural University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Hiroshima City University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Kobe City University of Foreign Studies': { total: 630, japanese: 330, math: 150, science: 150 },
  'Kochi University of Technology': { total: 600, japanese: 320, math: 140, science: 140 },
  'Kyoto Prefectural University': { total: 630, japanese: 330, math: 150, science: 150 },
  'Nagoya City University': { total: 630, japanese: 330, math: 150, science: 150 },
  'Osaka Metropolitan University': { total: 630, japanese: 330, math: 150, science: 150 },
  'Prefectural University of Hiroshima': { total: 600, japanese: 320, math: 140, science: 140 },
  'Saitama Prefectural University': { total: 600, japanese: 320, math: 140, science: 140 },
  'Tokyo Metropolitan University': { total: 630, japanese: 330, math: 150, science: 150 },
  'University of Aizu': { total: 630, japanese: 330, math: 150, science: 150 },
  'University of Hyogo': { total: 600, japanese: 320, math: 140, science: 140 },
  'University of Kitakyushu': { total: 600, japanese: 320, math: 140, science: 140 },
  'University of Nagano': { total: 600, japanese: 320, math: 140, science: 140 },
  'University of Shizuoka': { total: 630, japanese: 330, math: 150, science: 150 },
  'Yokohama City University': { total: 630, japanese: 330, math: 150, science: 150 },

  // Private Universities
  'Waseda University': { total: 710, japanese: 370, math: 170, science: 170 },
  'Keio University': { total: 710, japanese: 370, math: 170, science: 170 },
  'Meiji University': { total: 630, japanese: 310, math: 160, science: 160 },
  'Aoyama Gakuin University': { total: 630, japanese: 310, math: 160, science: 160 },
  'Rikkyo University': { total: 630, japanese: 310, math: 160, science: 160 },
  'Chuo University': { total: 630, japanese: 310, math: 160, science: 160 },
  'Hosei University': { total: 630, japanese: 310, math: 160, science: 160 },
  'Kwansei Gakuin University': { total: 630, japanese: 310, math: 160, science: 160 },
  'Kansai University': { total: 630, japanese: 310, math: 160, science: 160 },
  'Doshisha University': { total: 630, japanese: 310, math: 160, science: 160 },
  'Ritsumeikan University': { total: 630, japanese: 310, math: 160, science: 160 },
  'Kyoto Sangyo University': { total: 580, japanese: 300, math: 140, science: 140 },
  'Kinki University': { total: 580, japanese: 300, math: 140, science: 140 },
  'Osaka Institute of Technology': { total: 580, japanese: 300, math: 140, science: 140 },
  'Ryukoku University': { total: 580, japanese: 300, math: 140, science: 140 }
};

export const ejuScoreHumanities: Record<string, Omit<EjuScore, 'science'>> = {
  // National Universities
  'University of Tokyo': { total: 730, japanese: 360, math: 190 },
  'Kyoto University': { total: 730, japanese: 360, math: 190 },
  'Osaka University': { total: 700, japanese: 350, math: 180 },
  'Tohoku University': { total: 700, japanese: 350, math: 180 },
  'Nagoya University': { total: 700, japanese: 350, math: 180 },
  'Hokkaido University': { total: 700, japanese: 350, math: 180 },
  'Kyushu University': { total: 700, japanese: 350, math: 180 },
  'Hitotsubashi University': { total: 700, japanese: 350, math: 180 },
  'University of Tsukuba': { total: 650, japanese: 330, math: 170 },
  'Kobe University': { total: 670, japanese: 350, math: 170 },
  'Hiroshima University': { total: 650, japanese: 330, math: 170 },
  'Chiba University': { total: 650, japanese: 330, math: 170 },
  'Yokohama National University': { total: 650, japanese: 330, math: 170 },
  'Tokyo University of Foreign Studies': { total: 650, japanese: 330, math: 170 },
  'Ochanomizu University': { total: 650, japanese: 330, math: 170 },
  'Kanazawa University': { total: 650, japanese: 330, math: 170 },
  'Okayama University': { total: 650, japanese: 330, math: 170 },

  // Private Universities
  'Waseda University': { total: 680, japanese: 340, math: 170 },
  'Keio University': { total: 680, japanese: 340, math: 170 },
  'Sophia University': { total: 680, japanese: 340, math: 170 },
  'Meiji University': { total: 630, japanese: 330, math: 140 },
  'Aoyama Gakuin University': { total: 630, japanese: 330, math: 140 },
  'Rikkyo University': { total: 630, japanese: 330, math: 140 },
  'Chuo University': { total: 630, japanese: 330, math: 140 },
  'Hosei University': { total: 630, japanese: 330, math: 140 },
  'Kansai University': { total: 630, japanese: 330, math: 140 },
  'Kwansei Gakuin University': { total: 630, japanese: 330, math: 140 },
  'Doshisha University': { total: 630, japanese: 330, math: 140 },
  'Ritsumeikan University': { total: 630, japanese: 330, math: 140 },
  'Asia University': { total: 580, japanese: 320, math: 120 },
  'Kindai University': { total: 580, japanese: 320, math: 120 },
  'Komazawa University': { total: 580, japanese: 320, math: 120 },
  'Konan University': { total: 580, japanese: 320, math: 120 },
  'Kyoto Sangyo University': { total: 580, japanese: 320, math: 120 },
  'Meiji Gakuin University': { total: 580, japanese: 320, math: 120 },
  'Nihon University': { total: 580, japanese: 320, math: 120 },
  'Ryukoku University': { total: 580, japanese: 320, math: 120 },
  'Seikei University': { total: 580, japanese: 320, math: 120 },
  'Senshu University': { total: 580, japanese: 320, math: 120 },
  'Teikyo University': { total: 580, japanese: 320, math: 120 },
  'Tokai University': { total: 580, japanese: 320, math: 120 },
  'Toyo University': { total: 580, japanese: 320, math: 120 }
}; 