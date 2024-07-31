import { useState } from 'react';


function Square({ value, onSquareClick }) {

  return (
    <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

export default function Game() {
  // const [xIsNext, setXIsNext] = useState(true); // 0番目:変数、1番目:値を代入するときに使う関数
  const [history, setHistory] = useState([Array(9).fill(null)]);  // ['O', null, 'X', 'X', 'X', 'O', 'O', null, null] それぞれの盤面に該当する
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0; // できる限りStateは使わない
  // const currentSquares = history[history.length - 1]; // 最後の盤面を取得
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];// 過去のデータ(history)と新しいデータを入れる
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);//現在の盤面に移動
    // setXIsNext(!xIsNext);//プレイヤーOとXを入れ替え
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    // setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => { //squares:盤面、move:手数
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return ( //ジャンプボタンの追加
      <li key={move}> {/*keyは予約されたコンポーネント。コンポーネントの識別情報らしいがkeyがよくわからん！！！(keyを選ぶ 項)*/}
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}


function Board({ xIsNext, squares, onPlay }) {

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) { //判定(呼び出し関数は必ずしも上に置かなくて良い)
      return;
    }
    const nextSquares = squares.slice(); // 直接書き換えることですべての子要素が再レンダリングされることによるパフォーマンス低下を防止するために、コピーを作成
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    // setSquares(nextSquares);
    // setXIsNext(!xIsNext);

    onPlay(nextSquares); // boardを更新
  }

  return (
    <>
      <div className="board-row">
        <div className="status">{status}</div>
        {/* <Square value={squares[0]} onSquareClick={handleClick(0)} /> ←の書き方はNG。関数を呼び出してしまっている扱い。あくまでも関数を渡さないといけない */}
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />  {/*ここでアロー関数の出番*/}
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { //a==b==c
      return squares[a];
    }
  }
  return null;
}

