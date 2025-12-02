# ネットワーク・セキュリティの問題点

## 概要
広島大学もみじサイトのネットワーク・セキュリティに関する問題点をまとめました。

## 1. HTTPリンクの使用（重大度: 高）

### 問題
サイト内にHTTP（非暗号化）リンクが存在する可能性があります。HTTPSではないため、通信が暗号化されず、中間者攻撃（MITM）のリスクがあります。

**注意**: DOCTYPE宣言内のDTD参照（行1）やXML名前空間の宣言（行3、行2793のSVG名前空間）は、XML仕様の標準的な宣言であり、実際のHTTPリンクではありません。これらは修正対象外です。

### 実際の外部HTTPリンク（アクショナブル）

現在のコードベースを確認した結果、**実際の外部HTTPリンクは0箇所**です。以前のバージョンでは以下のリンクがHTTPで記述されていましたが、既にHTTPSに変更されています：

#### 以前のHTTPリンク（既に修正済み）
1. ✅ **Webメールポータル** (`http://www.media.hiroshima-u.ac.jp/services/webmail-portal`)
   - **状態**: 既にHTTPSに変更済み（行1505）
   - **アクショナブル**: 修正済み
   - **優先度**: 高（修正済み）

2. ✅ **情報メディア教育研究センター** (`http://www.media.hiroshima-u.ac.jp/`)
   - **状態**: 既にHTTPSに変更済み（行1564）
   - **アクショナブル**: 修正済み
   - **優先度**: 高（修正済み）

3. ✅ **外国語教育研究センター** (`http://www.hiroshima-u.ac.jp/flare/`)
   - **状態**: 既にHTTPSに変更済み（行1565）
   - **アクショナブル**: 修正済み
   - **優先度**: 高（修正済み）

4. ✅ **広島大学ライティングセンター** (`http://www.hiroshima-u.ac.jp/wrc/`)
   - **状態**: 既にHTTPSに変更済み（行1566）
   - **アクショナブル**: 修正済み
   - **優先度**: 高（修正済み）

5. ⚠️ **内容別問い合わせ先**（コメントアウト内、行1590付近）
   - **状態**: コメントアウトされているため、現在は影響なし
   - **アクショナブル**: コメントアウト解除時に確認が必要
   - **優先度**: 低（コメントアウト中）

### 修正対象外（XML仕様の宣言）

以下の項目はXML仕様の標準的な宣言であり、実際のHTTPリンクではないため、修正対象外です：

- ❌ **行1**: DOCTYPE宣言内のXHTML DTD参照 (`http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd`)
  - XML仕様の標準的なDTD参照
  - 修正不要

- ❌ **行3**: HTML名前空間の宣言 (`http://www.w3.org/1999/xhtml`)
  - XML名前空間の標準的な宣言
  - 修正不要

- ❌ **行2793**: SVG名前空間の宣言 (`http://www.w3.org/2000/svg`, `http://www.w3.org/1999/xlink`)
  - SVG仕様の標準的な名前空間宣言
  - 修正不要

### 影響
- 通信内容の傍受リスク（HTTPリンクが存在する場合）
- ブラウザのセキュリティ警告表示
- SEO評価の低下

### 優先順位付き対応チェックリスト

#### 1. 各アクショナブルなURLがHTTPSをサポートしているか確認
- [x] Webメールポータル: HTTPS対応確認済み
- [x] 情報メディア教育研究センター: HTTPS対応確認済み
- [x] 外国語教育研究センター: HTTPS対応確認済み
- [x] 広島大学ライティングセンター: HTTPS対応確認済み

#### 2. HTTPをHTTPSに置き換え（利用可能な場合）
- [x] すべての外部HTTPリンクをHTTPSに変更済み

#### 3. HTTPSに到達できない場合の緩和策
現在、すべての外部リンクがHTTPSに対応しているため、追加の緩和策は不要です。

**将来の対応**:
- 新しいHTTPリンクを追加する際は、事前にHTTPS対応を確認する
- HTTPS未対応の外部サイトへのリンクを追加する場合は、以下のいずれかの対応を検討：
  - サイト所有者にHTTPS対応を依頼
  - リンクに警告表示を追加
  - 代替のHTTPS対応サイトを探す

#### 4. 該当箇所とサマリーの更新
- **実際の外部HTTPリンク数**: 0箇所（すべてHTTPSに変更済み）
- **XML仕様の宣言**: 3箇所（修正不要）
- **コメントアウトされたHTTPリンク**: 1箇所（影響なし）

### 推奨対応
✅ **完了**: すべての外部HTTPリンクをHTTPSに変更済み

**今後の維持管理**:
- 新しい外部リンクを追加する際は、必ずHTTPSを使用する
- 定期的に外部リンクのHTTPS対応状況を確認する
- リンク切れやHTTPS未対応のリンクを監視する

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
1. **緊急**: ✅ HTTPリンクのHTTPS化（完了）、jQueryの更新
2. **高**: ✅ Tabnabbing対策（完了）、インラインJavaScriptの移行
3. **中**: document.write()の置き換え、CSRF対策の確認
4. **低**: Google Analytics 4への移行、CSPの実装

### 推奨されるセキュリティヘッダー
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`

