import { useEffect, useState } from "react";
import { commonUtil } from "@mvloans/base-ui.common";

const Timer = ({ timer }: any) => {
  const [counter, setCounter] = useState(timer);

  useEffect(() => {
    const id = setInterval(() => {
      setCounter((counter: number) => {
        if (id && counter <= 1) {
          clearInterval(id);
        }
        return counter - 1;
      });
    }, 1000);
  }, []);

  return counter === 0 ? null : commonUtil.countdownTimer(counter);
};

export default Timer;
