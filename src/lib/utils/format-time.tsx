import { formatDistanceToNowStrict } from "date-fns";
import { useEffect, useState } from "react";

const TimeAgo = ({ timestamp }: { timestamp: Date | string }) => {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    const updateRelativeTime = () => {
      const time = new Date(timestamp);
      const diffInSeconds = (Date.now() - time.getTime()) / 1000;

      if (diffInSeconds < 5) {
        setRelativeTime("Just now");
      } else {
        setRelativeTime(formatDistanceToNowStrict(time, { addSuffix: true }));
      }
    };

    updateRelativeTime();

    const interval = setInterval(updateRelativeTime, 60000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return <span>{relativeTime}</span>;
};

export default TimeAgo;