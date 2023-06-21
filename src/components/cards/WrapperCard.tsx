// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import React from "react";
import { Card } from "react-daisyui";

type WrapperCardProps = {
  id: string;
  children: React.ReactNode;
};

const WrapperCard = ({ id, children }: WrapperCardProps) => {
  return (
    <Card
      id={id}
      bordered={false}
      className="flex h-fit flex-col rounded-[14px] bg-white shadow-md">
      <Card.Body className="gap-4 p-4 md:gap-6 md:p-8">{children}</Card.Body>
    </Card>
  );
};

export default WrapperCard;
