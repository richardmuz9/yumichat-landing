import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'English' | '日本語' | '中文' | '한국어';

interface Translations {
  [key: string]: {
    English: string;
    '日本語': string;
    '中文': string;
    '한국어': string;
  };
}

const translations: Translations = {
  // Chat Screen
  chatPlaceholder: {
    English: "Chat with Yumi about study, life, or anything...",
    '日本語': "Yumiと留学、生活や悩みについて話そう～",
    '中文': "和Yumi聊聊留学、生活或心事吧～",
    '한국어': "Yumi와 유학, 생활이나 고민에 대해 이야기해요~"
  },
  send: {
    English: "Send",
    '日本語': "送信",
    '中文': "发送",
    '한국어': "보내기"
  },
  settings: {
    English: "Settings",
    '日本語': "設定",
    '中文': "设置",
    '한국어': "설정"
  },
  officeHelper: {
    English: "Office Helper (5/day)",
    '日本語': "オフィスヘルパー (1日5回)",
    '中文': "办公助手 (每天5次)",
    '한국어': "오피스 도우미 (하루 5회)"
  },
  vpnHelp: {
    English: "VPN Help",
    '日本語': "VPNヘルプ",
    '中文': "VPN帮助",
    '한국어': "VPN 도움말"
  },
  unlockPremium: {
    English: "Unlock Premium",
    '日本語': "プレミアム解除",
    '中文': "解锁高级版",
    '한국어': "프리미엄 해제"
  },
  // Word Helper Screen
  wordHelper: {
    English: "Word Helper",
    '日本語': "ワードヘルパー",
    '中文': "Word助手",
    '한국어': "워드 도우미"
  },
  // Excel Helper Screen
  excelHelper: {
    English: "Excel Helper",
    '日本語': "エクセルヘルパー",
    '中文': "Excel助手",
    '한국어': "엑셀 도우미"
  },
  // PPT Helper Screen
  pptHelper: {
    English: "PowerPoint Helper",
    '日本語': "パワーポイントヘルパー",
    '中文': "PPT助手",
    '한국어': "파워포인트 도우미"
  },
  // Mental Health Helper Screen
  mentalHealth: {
    English: "Mental Health Helper",
    '日本語': "メンタルヘルスヘルパー",
    '中文': "心理健康助手",
    '한국어': "정신 건강 도우미"
  },
  // Common
  startNewChat: {
    English: "Start New Chat",
    '日本語': "新しいチャットを始める",
    '中文': "开始新对话",
    '한국어': "새 채팅 시작"
  },
  chatHistory: {
    English: "Chat History",
    '日本語': "チャット履歴",
    '中文': "聊天记录",
    '한국어': "채팅 기록"
  },
  myArchive: {
    English: "My Archive",
    '日本語': "マイアーカイブ",
    '中文': "我的存档",
    '한국어': "내 보관함"
  },
  vpnHeader: {
    English: "VPN Help & Recommendations",
    '日本語': "VPNヘルプとおすすめ",
    '中文': "VPN帮助与推荐",
    '한국어': "VPN 도움말 및 추천"
  },
  recommendedVPN: {
    English: "Recommended VPNs",
    '日本語': "おすすめVPN",
    '中文': "推荐VPN",
    '한국어': "추천 VPN"
  },
  clashTitle: { English: "Clash Verge", '日本語': "Clash Verge", '中文': "Clash Verge", '한국어': "Clash Verge" },
  clashDesc: { English: "A free, open-source VPN client for Windows/Mac.", '日本語': "Windows/Mac用の無料オープンソースVPNクライアント。", '中文': "适用于Windows/Mac的免费开源VPN客户端。", '한국어': "Windows/Mac용 무료 오픈소스 VPN 클라이언트." },
  githubLink: { English: "GitHub Download", '日本語': "GitHubダウンロード", '中文': "GitHub下载", '한국어': "GitHub 다운로드" },
  nexitallyTitle: { English: "Nexitally", '日本語': "Nexitally", '中文': "Nexitally", '한국어': "Nexitally" },
  nexitallyDesc: { English: "A paid, stable VPN for China.", '日本語': "中国向けの有料安定VPN。", '中文': "适用于中国的付费稳定VPN。", '한국어': "중국용 유료 안정 VPN." },
  officialLink: {
    English: "Official Website",
    '日本語': "公式サイト",
    '中文': "官方网站",
    '한국어': "공식 웹사이트"
  },
  vpnChinaTitle: { English: "VPNChina", '日本語': "VPNChina", '中文': "VPNChina", '한국어': "VPNChina" },
  vpnChinaDesc: { English: "A paid VPN for China.", '日本語': "中国向けの有料VPN。", '中文': "适用于中国的付费VPN。", '한국어': "중국용 유료 VPN." },
  lanternTitle: { English: "Lantern", '日本語': "Lantern", '中文': "Lantern", '한국어': "Lantern" },
  lanternDesc: {
    English: "A simple VPN for all platforms.",
    '日本語': "全プラットフォーム対応のシンプルVPN。",
    '中文': "适用于所有平台的简单VPN。",
    '한국어': "모든 플랫폼용 간단한 VPN."
  },
  outlineTitle: {
    English: "Outline",
    '日本語': "Outline",
    '中文': "Outline",
    '한국어': "Outline"
  },
  outlineDesc: {
    English: "Set up your own VPN server.",
    '日本語': "自分でVPNサーバーを構築。",
    '中文': "自己搭建VPN服务器。",
    '한국어': "직접 VPN 서버 구축."
  },
  windowsTutorial: {
    English: "Windows Setup Tutorial",
    '日本語': "Windows設定チュートリアル",
    '中文': "Windows设置教程",
    '한국어': "Windows 설정 튜토리얼"
  },
  windowsStep1: {
    English: "1. Download and install the VPN client.",
    '日本語': "1. VPNクライアントをダウンロードしてインストール。",
    '中文': "1. 下载并安装VPN客户端。",
    '한국어': "1. VPN 클라이언트 다운로드 및 설치."
  },
  windowsStep2: {
    English: "2. Import the configuration file.",
    '日本語': "2. 設定ファイルをインポート。",
    '中文': "2. 导入配置文件。",
    '한국어': "2. 설정 파일 가져오기."
  },
  windowsStep3: {
    English: "3. Connect and enjoy secure browsing.",
    '日本語': "3. 接続して安全なブラウジングを楽しむ。",
    '中文': "3. 连接并享受安全浏览。",
    '한국어': "3. 연결 후 안전한 브라우징 즐기기."
  },
  macTutorial: {
    English: "Mac Setup Tutorial",
    '日本語': "Mac設定チュートリアル",
    '中文': "Mac设置教程",
    '한국어': "Mac 설정 튜토리얼"
  },
  macStep1: {
    English: "1. Download and install the VPN client.",
    '日本語': "1. VPNクライアントをダウンロードしてインストール。",
    '中文': "1. 下载并安装VPN客户端。",
    '한국어': "1. VPN 클라이언트 다운로드 및 설치."
  },
  macStep2: {
    English: "2. Import the configuration file.",
    '日本語': "2. 設定ファイルをインポート。",
    '中文': "2. 导入配置文件。",
    '한국어': "2. 설정 파일 가져오기."
  },
  macStep3: {
    English: "3. Connect and enjoy secure browsing.",
    '日本語': "3. 接続して安全なブラウジングを楽しむ。",
    '中文': "3. 连接并享受安全浏览。",
    '한국어': "3. 연결 후 안전한 브라우징 즐기기."
  },
  qrCode: {
    English: "QR Code",
    '日本語': "QRコード",
    '中文': "二维码",
    '한국어': "QR 코드"
  },
  qrCodeDesc: {
    English: "Scan to download the VPN app.",
    '日本語': "スキャンしてVPNアプリをダウンロード。",
    '中文': "扫码下载VPN应用。",
    '한국어': "스캔하여 VPN 앱 다운로드."
  },
  close: {
    English: "Close",
    '日本語': "閉じる",
    '中文': "关闭",
    '한국어': "닫기"
  },
  premiumStudyCenter: { English: "Premium Study Center", '日本語': "プレミアム学習センター", '中文': "高级学习中心", '한국어': "프리미엄 학습 센터" },
  membershipPrice: { English: "Membership Price", '日本語': "会員価格", '中文': "会员价格", '한국어': "멤버십 가격" },
  supportedPaymentMethods: { English: "Supported Payment Methods", '日本語': "対応支払い方法", '中文': "支持的支付方式", '한국어': "지원 결제 방법" },
  alipayPayment: { English: "Alipay Payment", '日本語': "Alipay支払い", '中文': "支付宝支付", '한국어': "알리페이 결제" },
  wechatPayment: { English: "WeChat Payment", '日本語': "WeChat支払い", '中文': "微信支付", '한국어': "위챗 결제" },
  unionPayPayment: { English: "UnionPay Payment", '日本語': "UnionPay支払い", '中文': "银联支付", '한국어': "유니온페이 결제" },
  creditCardPayment: { English: "Credit Card Payment", '日本語': "クレジットカード支払い", '中文': "信用卡支付", '한국어': "신용카드 결제" },
  paymentCompleted: { English: "Payment Completed", '日本語': "支払い完了", '中文': "支付完成", '한국어': "결제 완료" },
  processing: { English: "Processing...", '日本語': "処理中...", '中文': "处理中...", '한국어': "처리 중..." },
  premiumUnlocked: { English: "Premium Unlocked!", '日本語': "プレミアム解除！", '中文': "高级版已解锁！", '한국어': "프리미엄 해제됨!" },
  language: { English: "Language", '日本語': "言語", '中文': "语言", '한국어': "언어" },
  english: { English: "English", '日本語': "英語", '中文': "英语", '한국어': "영어" },
  japanese: { English: "Japanese", '日本語': "日本語", '中文': "日语", '한국어': "일본어" },
  chinese: { English: "Chinese", '日本語': "中国語", '中文': "中文", '한국어': "중국어" },
  korean: { English: "Korean", '日本語': "韓国語", '中文': "韩语", '한국어': "한국어" },
  mood: { English: "Mood", '日本語': "気分", '中文': "心情", '한국어': "기분" },
  dere: { English: "Dere", '日本語': "デレ", '中文': "傲娇", '한국어': "데레" },
  tsun: { English: "Tsun", '日本語': "ツン", '中文': "傲娇", '한국어': "츤" },
  saveSettings: { English: "Save Settings", '日本語': "設定を保存", '中文': "保存设置", '한국어': "설정 저장" },
  moodJournal: { English: "Mood Journal", '日本語': "気分日記", '中文': "心情日记", '한국어': "기분 일기" },
  chat: { English: "Chat", '日本語': "チャット", '中文': "聊天", '한국어': "채팅" },
  romance: { English: "Romance", '日本語': "ロマンス", '中文': "恋爱", '한국어': "로맨스" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'English',
  setLanguage: () => {},
  t: () => '',
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('English');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('language');
      if (savedLang && isValidLanguage(savedLang)) {
        setLanguage(savedLang as Language);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  };

  const isValidLanguage = (lang: string): lang is Language => {
    return ['English', '日本語', '中文', '한국어'].includes(lang);
  };

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translations[key][language] || translations[key]['English'];
  };

  const handleSetLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem('language', newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};