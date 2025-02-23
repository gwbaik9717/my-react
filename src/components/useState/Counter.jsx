import { renderApp } from "../..";
import { React } from "../../lib/react";

export const Counter = () => {
  const [count, setCount] = React.useState(0);

  const handleClick = () => {
    setCount((prevCount) => prevCount + 1);

    // 강제 전체 리렌더링
    renderApp();
  };

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button id="btn" onClick={handleClick}>
        증가
      </button>
    </div>
  );
};
