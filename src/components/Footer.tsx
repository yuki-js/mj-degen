import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem 0',
      marginTop: 'auto',
      fontSize: '0.875rem',
      color: '#6c757d'
    }}>
      <p>
        文字情報技術促進協議会は、文字情報基盤 縮退マップ（MJ縮退マップ） を{' '}
        <a href="http://creativecommons.org/licenses/by-sa/2.1/jp/" target="_blank" rel="noopener noreferrer">
          クリエイティブ・コモンズ 表示 – 継承 2.1 日本 ライセンス
        </a>
        {' '}によって提供しています。MJ縮退マップ(JSON形式)はIPAの著作物です。
        <br />
        本ソフトウェアのMJ縮退マップの部分に関しては、CC-BY-SA 2.1 JPライセンスでリライセンスします。
      </p>
      <p>本ソフトウェアはGoogle Geminiによって生成されました。</p>
      <p>本ソフトウェアのMJ縮退マップ以外の部分は、<a href="https://github.com/yuki-js/mj-degen/blob/main/LICENSE.md" target="_blank" rel="noopener noreferrer">AokiApp Normative Application License (ANAL) 1.0</a>に基づいてライセンスされています。</p>
    </footer>
  );
};

export default Footer;
