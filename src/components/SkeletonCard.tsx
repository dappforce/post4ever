import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Card } from "react-daisyui";

const SkeletonCard = () => {
  return (
    <Card
      key="skeleton-card"
      bordered={false}
      className="border rounded-lg border-[#d9d9d9] shadow-[0px_4px_+13px_#E1E6E8] bg-white h-fit">
      <Card.Body className="card-body px-4 py-5 gap-[14px]">
        <div className="flex">
          <Skeleton inline circle width={40} height={40} containerClassName="w-50 mr-4" />
          <div className="flex-1">
            <Skeleton />
            <Skeleton />
          </div>
        </div>
        <div className="py-2 px-4">
          <Skeleton count={3} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default SkeletonCard;
