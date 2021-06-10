export class Table {
  cardNumber: number;
  arr: string[];
  sts: number[];
  // ready: number;

  constructor(cardNumber: number, arr: string[], sts: number[]) {
    this.cardNumber = cardNumber;
    this.arr = arr; //それぞれのマーク2枚ずつを格納する配列
    this.sts = sts; //カードの状態を表す配列

    // ここでシャッフルしてもらう
    this.arr = this.shuffle(this.arr);
  }

  //   カードをシャッフルする関数
  public shuffle([...array]: string[]): string[] {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
