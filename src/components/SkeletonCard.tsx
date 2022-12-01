import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Card } from "react-daisyui";

const SkeletonCard = () => {
  return (
    <Card
      key="skeleton-card"
      bordered={false}
      className="drop-shadow-xl bg-white p-4 mt-4 h-fit border">
      <Card.Body>
        <div className="flex">
          <Skeleton inline circle width={40} height={40} containerClassName="w-50 mr-4" />
          <div className="flex-1">
            <Skeleton />
            <Skeleton />
          </div>
        </div>
        <div>
          <Skeleton count={3} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default SkeletonCard;
