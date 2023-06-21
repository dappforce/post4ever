// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import { useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { Button, Card, Avatar } from "react-daisyui";

import { trimMiddleString } from "src/utils/string";
import { TwitterShareButton } from "react-share";

import { SuccessPayloadProps } from "src/hooks/subsocial-api.types";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import type { WalletAccount } from "@talismn/connect-wallets";

import XIcon from "public/images/XIcon.svg";

import dynamic from "next/dynamic";
const ReactIdenticon = dynamic(() => import("src/components/ReactIdenticon"), {
  ssr: false,
});

import {
  SUBSOCIAL_TWITTER_URL,
  SUBSOCIAL_HASHTAG_TWITTER_URL,
  POST4EVER_URL,
  polkaverseContentURL,
} from "src/configs/urls";

import { SUB_IPFS_NODE_URL } from "src/configs/sdk-network-config";

type SuccessDialogProps = {
  open: boolean;
  onClose: () => void;
  contentId: SuccessPayloadProps | undefined;
  account: WalletAccount | null;
};

const SuccessDialog = (props: SuccessDialogProps) => {
  const { open, onClose, contentId, account } = props;

  useEffect(() => {
    if (account) checkProfileSpaceOwnedBy(account.address);
  }, [account]);

  const { profileSpace, checkProfileSpaceOwnedBy } = useSubSocialApiHook();

  if (!account) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.5, y: 50 },
      }}
      className="min-w-fit max-w-fit rounded-2xl px-5 py-5 backdrop-blur-[1px] md:min-w-[520px] md:max-w-[520px] md:p-6 lg:min-w-[30%] lg:p-8">
      <DialogHeader className="flex flex-col items-center justify-center gap-2 p-0">
        <div className="flex w-full flex-row items-center justify-end px-0 text-xl font-bold leading-7 text-[#222222] md:text-2xl">
          <div className="ml-auto">🎉 Tweet published</div>
          <div onClick={onClose} className="ml-auto cursor-pointer">
            <XIcon />
          </div>
        </div>
        <div className="text-base font-normal leading-[140%] text-[#585858]">
          Tweet successfully saved to the blockchain!
        </div>
      </DialogHeader>
      <DialogBody className="px-0 md:pt-6 md:pb-4">
        <Card bordered={false} className="rounded-lg border border-dark-gray bg-white">
          <Card.Body className="max-w-full gap-4 p-4 md:gap-6 md:p-6">
            <div className="flex flex-row items-center justify-center gap-2 self-start">
              {profileSpace?.content?.image ? (
                <Avatar
                  src={`${SUB_IPFS_NODE_URL}/${profileSpace?.content?.image}`}
                  size="xs"
                  shape="circle"
                />
              ) : (
                <ReactIdenticon address={account.address!} size={40} />
              )}
              <div>
                <div className="font-bold text-neutral">
                  {profileSpace?.content?.name ?? account.name}
                </div>
                <div className="font-normal text-gray-500">{trimMiddleString(account.address)}</div>
              </div>
            </div>
            <p className="text-base font-normal text-neutral">
              I just cross-posted a tweet to the{" "}
              <a
                className="link-hover link whitespace-nowrap text-link-blue"
                target="_blank"
                rel="noopener noreferrer"
                href={SUBSOCIAL_TWITTER_URL}>
                @SubsocialChain
              </a>{" "}
              network to make it censorship resistant by using{" "}
              <a
                className="link-hover link whitespace-nowrap text-link-blue"
                target="_blank"
                rel="noopener noreferrer"
                href={POST4EVER_URL}>
                {POST4EVER_URL}
              </a>{" "}
              🔥
              <br />
              <br />
              View it on Subsocial here:
              <a
                className="link-hover link text-link-blue"
                target="_blank"
                rel="noopener noreferrer"
                href={polkaverseContentURL(contentId)}>
                {polkaverseContentURL(contentId)}
              </a>
              <br />
              <br />
              <a
                className="link whitespace-nowrap text-link-blue no-underline"
                target="_blank"
                rel="noopener noreferrer"
                href={SUBSOCIAL_HASHTAG_TWITTER_URL}>
                #Subsocial
              </a>
            </p>
          </Card.Body>
        </Card>
      </DialogBody>
      <DialogFooter className="flex flex-col gap-4 p-0">
        <TwitterShareButton
          className="btn-gradient btn w-full"
          url={`${polkaverseContentURL(contentId)}\n\n`}
          hashtags={["Subsocial"]}
          title={`I just cross-posted a tweet to the @SubsocialChain network to make it censorship resistant!`}>
          <span className="text-base font-medium text-white">Tweet about it!</span>
        </TwitterShareButton>
        <Button
          onClick={onClose}
          className="btn-outline btn-accent btn w-full whitespace-nowrap rounded-lg normal-case">
          <span className="text-base">Cross-post another tweet</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default SuccessDialog;
