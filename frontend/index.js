// Expressをインポート
const express = require("express");

// アプリケーションを作成
const app = express();

// ポート番号を設定
const port = 3000;

// buildディレクトリを静的なファイルのルートとして設定
app.use(express.static("build"));

// すべてのリクエストに対してindex.htmlを返す
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

// サーバーを起動
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});