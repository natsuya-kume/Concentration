import React, { FC } from "react";
import "./Concentration.css";

interface CardComponentProps {
  key: number;
  number: string;
  ready: number;
  onClick(): void;
}
const Card: FC<CardComponentProps> = (props) => {
  let cardStyle: string = "card card-ura";
  let numStyle: string = "omote";
  switch (props.ready) {
    case 1:
      numStyle = "ura";
      break;
    case 2:
      numStyle = "ura atari";
      break;
    case 3:
      numStyle = "ura hazure";
      break;
    default:
      cardStyle = "card card-omote";
      break;
  }
  return (
    <button className={cardStyle} onClick={() => props.onClick()}>
      <div className={numStyle}>
        <span>{props.number}</span>
      </div>
    </button>
  );
};

export default Card;
