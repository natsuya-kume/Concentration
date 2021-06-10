import { Component } from "react";
import { Table } from "./Table";
import Card from "./Card";
// import { BoardComponent } from "./BoardComponent";

// stateの型を宣言
interface GameState {
  cards: string[];
  status: number[];
  ready: number;
  message: string;
  count: number;
  timer: any;
  title: string;
  run: boolean;
  overlay: string;
}

export default class GameComponent extends Component<{}, GameState> {
  table: Table;

  constructor(props: {}) {
    super(props);
    this.table = new Table(
      10,
      Array("♡", "♡", "♢", "♢", "♤", "♤", "♧", "♧", "♥", "♥"),
      Array(10).fill(0)
    );
    // 初期値の設定
    this.state = {
      cards: this.table.arr,
      status: this.table.sts,
      ready: -1,
      message: "",
      count: 15,
      timer: null,
      title: "",
      run: false,
      overlay: "overlay",
    };
  }

  renderCard(i: number) {
    return (
      <Card
        key={i}
        number={this.state.cards[i]}
        ready={this.state.status[i]}
        onClick={() => this.cardClicked(i)}
      />
    );
  }
  render() {
    const cards = [];
    for (let i = 0; i < 10; i++) {
      cards.push(this.renderCard(i));
    }
    return (
      <div>
        <button className="start-button" onClick={() => this.gameStart()}>
          スタート
        </button>
        <div className="count-number">残り：{this.state.count}秒</div>
        <div className="table">{cards}</div>
        <div className="status">{this.state.message}</div>
        <div className={this.state.overlay}>
          <p className="title">{this.state.title}</p>
        </div>
      </div>
    );
  }

  // スタートボタンが押された時の関数
  private gameStart() {
    // 既にゲーム実行中であれば何もしない
    if (this.state.run) {
      return;
    }
    const timer = window.setInterval(() => {
      this.countDown();
    }, 1000);
    this.setState({ timer: timer, run: true, overlay: "" });
  }

  private countDown(): void {
    let nextCount = this.state.count - 1;
    if (nextCount < 1) {
      this.setState({
        message: "",
        count: 0,
        run: false,
        title: "ゲームオーバー",
        overlay: "overlay overlay-end",
      });
      clearInterval(this.state.timer);
    } else {
      this.setState({
        count: nextCount,
      });
    }
  }

  // カードがクリックされた時に呼ばれる関数
  private cardClicked(i: number): void {
    const sts: number[] = this.state.status.slice();
    //未選択以外をクリックされた時は無視
    if (this.state.status[i] !== 0) {
      return;
    }
    // ゲームスタートしてなければ無視
    let run = this.state.run;
    if (!run) {
      return;
    }
    let ready = -1;
    let message = "";
    let title = "";
    let overlay = "";
    // ハズレが表示された時
    if (this.state.ready === -2) {
      return;
      //1枚目をクリックした時の処理
    } else if (this.state.ready === -1) {
      // クリックされたところを1にする
      sts[i] = 1;
      ready = i;
      //2枚目をクリックした時の処理
    } else if (this.state.ready !== i) {
      // クリックされたところを1にする
      sts[i] = 1;
      //2枚揃ったかどうかを判定
      if (this.state.cards[this.state.ready] === this.state.cards[i]) {
        message = "あたり";
        sts[this.state.ready] = 2;
        sts[i] = 2;
        // ゲームが終わっていない時
        if (!this.isFinish(sts)) {
          setTimeout(() => {
            this.cardClear();
          }, 800);
        } else {
          message = "";
          run = false;
          title = "おめでとうございます。卒業です！";
          overlay = "overlay overlay-end";
          clearInterval(this.state.timer);
        }
        // 二枚が揃っていなかった時
      } else {
        message = "はずれ";
        ready = -2;
        sts[this.state.ready] = 3;
        sts[i] = 3;
        const rollbacksts = this.state.status.slice();
        rollbacksts[this.state.ready] = 0;
        rollbacksts[i] = 0;
        setTimeout(() => {
          this.cardClear();
          this.cardReset(rollbacksts);
        }, 800);
      }
    }
    this.setState({
      status: sts,
      ready: ready,
      message: message,
      run: run,
      title: title,
      overlay: overlay,
    });
  }

  // わずかな時間「あたり」「はずれ」のメッセージを表示させたあとは表示削除
  private cardClear(): void {
    this.setState({ message: "" });
  }

  private cardReset(sts: number[]): void {
    this.setState({ status: sts, ready: -1 });
  }

  private isFinish(status: number[]): boolean {
    let flg = true;
    for (let i = 0; i < status.length; i++) {
      // 揃っていないカードがある場合
      if (status[i] !== 2) {
        flg = false;
        break;
      }
    }
    return flg;
  }
}
