import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import SuggestionCard from "../suggestion/SuggestionCard";
import { CircularProgress } from "@mui/material";

interface SuggestionLargeListListProps {
  items: SuggestionModel[];
  approveSuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
}

function SuggestionLargeList({ items }: SuggestionLargeListListProps) {
  const [displayItems, setDisplayItems] = useState<SuggestionModel[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    setDisplayItems(items.slice(0, 20));
    setStartIndex(20);
  }, [items]);

  const fetchMoreData = () => {
    if (startIndex >= items.length) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      const nextItems = items.slice(startIndex, startIndex + 20);
      setDisplayItems((prev) => prev.concat(nextItems));
      setStartIndex((prev) => prev + 20);
    }, 1500);
  };

  return (
    <InfiniteScroll
      className="h-full flex flex-wrap justify-center"
      dataLength={displayItems.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={
        <div className="flex items-center justify-center">
          <CircularProgress size={30} color="inherit" />
        </div>
      }
    >
      {displayItems.map((item, index) => (
        <div key={item.id}>
          <SuggestionCard
            index={index}
            deleteSuggestion={() => {}}
            suggestion={item}
          />
        </div>
      ))}
    </InfiniteScroll>
  );
}

export default SuggestionLargeList;
