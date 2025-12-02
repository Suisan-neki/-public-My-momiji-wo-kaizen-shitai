# ネットワーク・セキュリティの問題点

## 概要
広島大学もみじサイトのネットワーク・セキュリティに関する問題点をまとめました。

## 1. HTTPリンクの使用（重大度: 高）

### 問題
サイト内にHTTP（非暗号化）リンクが8箇所存在します。HTTPSではないため、通信が暗号化されず、中間者攻撃（MITM）のリスクがあります。

### 該当箇所
- 行1: DOCTYPE宣言内のXHTML DTD参照
- 行3: HTML名前空間の宣言
- 行1500: Webメールポータルへのリンク (`http://www.media.hiroshima-u.ac.jp/services/webmail-portal`)
- 行1559: 情報メディア教育研究センターへのリンク (`http://www.media.hiroshima-u.ac.jp/`)
- 行1560: 外国語教育研究センターへのリンク (`http://www.hiroshima-u.ac.jp/flare/`)
- 行1561: 広島大学ライティングセンターへのリンク (`http://www.hiroshima-u.ac.jp/wrc/`)
- 行1590: 内容別問い合わせ先へのリンク（コメントアウト内）
- 行2793: SVG名前空間の宣言

### 影響
- 通信内容の傍受リスク
- ブラウザのセキュリティ警告表示
- SEO評価の低下

### 推奨対応
すべてのHTTPリンクをHTTPSに変更する。

---

## 2. Tabnabbing攻撃のリスク（重大度: 中）

### 問題
`target="_blank"`を使用している外部リンクのうち、`rel="noopener"`または`rel="noreferrer"`が設定されていない箇所が多数存在します。

### 統計
- `target="_blank"`の使用箇所: 約69箇所
- `rel="noopener"`が設定されている箇所: 1箇所のみ（行239）
- 未設定の箇所: 約68箇所

### 該当例
```html
<!-- 問題のある例 -->
<a href="https://momiji.hiroshima-u.ac.jp/momiji-top/information/system/" target="_blank">こちら</a>

<!-- 正しい例 -->
<a href="https://momiji.hiroshima-u.ac.jp/momiji-top/information/system/" target="_blank" rel="noopener noreferrer">こちら</a>
```

### 影響
悪意のあるサイトが`window.opener`を利用して元のページを操作する可能性があります。

### 推奨対応
すべての`target="_blank"`リンクに`rel="noopener noreferrer"`を追加する。

---

## 3. 古いjQueryバージョンの使用（重大度: 高）

### 問題
jQuery 1.8.2（2012年リリース）を使用しています。このバージョンには既知のセキュリティ脆弱性が複数存在します。

### 該当箇所
- `assets/js/jquery-1.8.2.min.js`

### 既知の脆弱性
- CVE-2015-9251: XSS脆弱性
- CVE-2019-11358: プロトタイプ汚染
- その他、多数のセキュリティパッチ未適用

### 影響
- XSS攻撃のリスク
- プロトタイプ汚染による脆弱性
- 最新ブラウザとの互換性問題

### 推奨対応
jQueryを最新バージョン（3.x系）に更新するか、バニラJavaScriptへの移行を検討する。

---

## 4. インラインJavaScriptの使用（重大度: 中）

### 問題
HTML内にインラインで`onclick`属性を使用している箇所が多数存在します。

### 該当箇所
- 行220: `onclick="ga('send', 'event', ...)"`
- 行235: `onclick="return momiji_login()"`
- 行756: `onclick="return enq_login()"`
- 行1473以降: 多数のGoogle Analyticsイベント送信
- 行1625: `href="javascript:void(0);"`
- 行2793: `onclick="sinclo.operatorInfo.toggle()"`など

### 影響
- Content Security Policy (CSP) の実装が困難
- XSS攻撃のリスク増加
- コードの保守性低下

### 推奨対応
すべてのインラインイベントハンドラを外部JavaScriptファイルに移行し、`addEventListener`を使用する。

---

## 5. 古いGoogle Analyticsの使用（重大度: 低）

### 問題
Universal Analytics（旧Google Analytics）を使用しています。このサービスは2023年7月に終了しています。

### 該当箇所
- 行22-28: Universal Analyticsの初期化コード
- 行25: `https://www.google-analytics.com/analytics.js`の読み込み

### 影響
- 分析データの取得ができない
- 最新の分析機能が使用できない

### 推奨対応
Google Analytics 4 (GA4) に移行する。

---

## 6. document.write()の使用（重大度: 中）

### 問題
`common.js`内で`document.write()`を使用してスタイルシートを動的に読み込んでいます。

### 該当箇所
`assets/js/common.js` 行1-9

```javascript
document.write('<link rel="stylesheet" href="..." type="text/css" />');
```

### 影響
- パフォーマンスの低下
- モダンブラウザでの動作不良の可能性
- セキュリティリスク（XSS攻撃の可能性）

### 推奨対応
`document.createElement()`と`appendChild()`を使用するか、条件付きCSS読み込みを実装する。

---

## 7. 外部リソースのセキュリティポリシー未設定（重大度: 低）

### 問題
外部リソース（CDN、サードパーティスクリプト）の読み込み時に、セキュリティポリシーが設定されていません。

### 該当箇所
- Google Analyticsスクリプト
- MediaTalkチャットウィジェット
- その他の外部スクリプト

### 影響
- サードパーティスクリプトによるセキュリティリスク
- データ漏洩の可能性

### 推奨対応
Content Security Policy (CSP) ヘッダーを設定し、信頼できるドメインのみからのリソース読み込みを許可する。

---

## 8. フォーム送信のセキュリティ対策不足（重大度: 中）

### 問題
フォーム送信時にCSRF対策（トークン検証）が実装されているか不明です。

### 該当箇所
- 行234: ログインフォーム
- 行248, 274: 検索フォーム

### 影響
- CSRF攻撃のリスク
- 不正なリクエストの送信

### 推奨対応
CSRFトークンの実装を確認し、必要に応じて追加する。

---

## まとめ

### 優先度別対応
1. **緊急**: HTTPリンクのHTTPS化、jQueryの更新
2. **高**: Tabnabbing対策、インラインJavaScriptの移行
3. **中**: document.write()の置き換え、CSRF対策の確認
4. **低**: Google Analytics 4への移行、CSPの実装

### 推奨されるセキュリティヘッダー
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`

