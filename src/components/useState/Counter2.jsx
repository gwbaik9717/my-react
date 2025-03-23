import { rerender } from "../..";
import { React } from "../../lib/react";

export const Counter2 = () => {
  const [count, setCount] = React.useState(1);

  // Manually set up interval
  if (!Counter2.interval) {
    Counter2.interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
      rerender();
    }, 1000);
  }

  return (
    <div>
      <p>현재 카운트: {count}</p>
      {count % 2 === 0 && <p>짝수입니다!</p>}
    </div>
  );
};

// Clear interval when the component is unmounted
Counter2.cleanup = () => {
  if (Counter.interval) {
    clearInterval(Counter.interval);
    Counter.interval = null;
  }
};
