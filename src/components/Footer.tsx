import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "2rem 0",
        marginTop: "auto",
        fontSize: "0.875rem",
        color: "#6c757d",
      }}
    >
      <p>
        文字情報技術促進協議会は、文字情報基盤
        文字情報一覧表（MJ文字情報一覧表）、文字情報基盤
        縮退マップ（MJ縮退マップ） を{" "}
        <a
          href="http://creativecommons.org/licenses/by-sa/2.1/jp/"
          target="_blank"
          rel="noopener noreferrer"
        >
          クリエイティブ・コモンズ 表示 – 継承 2.1 日本 ライセンス
        </a>{" "}
        によって提供しています。MJ縮退マップ(JSON形式)、MJ文字情報一覧表はIPAの著作物です。
        <br />
        本ソフトウェアのうち、文字情報技術促進協議会の著作物の部分に関しては、CC-BY-SA
        2.1 JPライセンスでリライセンスします。
      </p>
      <p>
        本ソフトウェアはGoogle Gemini、Anthropic Claude, OpenAI
        GPTによって生成されました。
      </p>
      <p>
        本ソフトウェアのプログラムの部分は、
        <a
          href="https://github.com/yuki-js/mj-degen/blob/main/LICENSE.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          AokiApp Normative Application License (ANAL) 1.0
        </a>
        に基づいてライセンスされています。
      </p>
    </footer>
  );
};

export default Footer;
