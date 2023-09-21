import React from 'react';
import './css/App.css';

// 円形のコンポーネント
function Circle(props) {
  return (
    <div className="circle" style={{backgroundColor: props.color, width: `100px`, height: `100px`}}>
    </div>
  );
}

// ハニカム構造のコンポーネント
function Honeycomb(props) {
  // 円形の色の配列
  const colors = ["red", "orange", "yellow", "green", "blue", "purple"];
  // 円形の数
  const num = props.num;
  // 円形の直径
  const diameter = props.diameter;
  // 円形の半径
  const radius = diameter / 2;
  // 円形の間隔
  const gap = props.gap;
  // ハニカム構造の幅
  const width = diameter + (num - 1) * (radius + gap);
  // ハニカム構造の高さ
  const height = Math.sqrt(3) * radius + gap;

  // 円形のコンポーネントの配列を作成する関数
  function createCircles(row) {
    let circles = [];
    for (let i = 0; i < num; i++) {
      // 円形の色をランダムに選択
      let color = colors[Math.floor(Math.random() * colors.length)];
      // 円形の位置を計算
      let left = i * (radius + gap);
      let top = row % 2 === 0 ? 0 : height / 2;
      // 円形のコンポーネントを作成して配列に追加
      circles.push(
        <Circle key={i} color={color} style={{left: left, top: top}}/>
      );
    }
    return circles;
  }

  // ハニカム構造のコンポーネントの配列を作成する関数
  function createHoneycombs() {
    let honeycombs = [];
    for (let j = 0; j < num; j++) {
      // ハニカム構造の位置を計算
      let left = j % 2 === 0 ? -radius / 2 : radius / 2;
      let top = j * height;
      // ハニカム構造のコンポーネントを作成して配列に追加
      honeycombs.push(
        <div key={j} className="honeycomb" style={{left: left, top: top, width: width, height: height}}>
          {createCircles(j)}
        </div>
      );
    }
    return honeycombs;
  }

  return (
    <div className="container">
      {createHoneycombs()}
    </div>
  );
}

// アプリケーションのコンポーネント
function App() {
  return (
    <div className="App">
      <h1>ハニカム構造に並べられた円形</h1>
      <Honeycomb num={5} diameter={200} gap={10}/>
    </div>
  );
}

export default App;