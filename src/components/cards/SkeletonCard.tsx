// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Card } from "react-daisyui";

const SkeletonCard = () => {
  return (
    <Card
      key="skeleton-card"
      bordered={false}
      className="h-fit rounded-lg border border-dark-gray bg-white shadow-[0px_4px_+13px_#E1E6E8]">
      <Card.Body className="card-body gap-[14px] px-4 py-5">
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
