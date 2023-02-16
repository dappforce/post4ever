import { Alert, AlertProps } from "react-daisyui";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import CopyText from "./CopyText";
import Link from "./Link";
import clsx from "clsx";
import { toSubsocialAddress } from "@subsocial/utils";

export type EnergyAlertProps = AlertProps & {
  address: string;
};

export default function EnergyAlert({ address, ...props }: EnergyAlertProps) {
  if (!address) return null;

  return (
    <Alert
      className={clsx("rounded-lg border border-base-yellow bg-light-yellow", props.className)}
      dataTheme="warning">
      <div className="flex flex-col">
        <div className="flex gap-1">
          <HiOutlineExclamationTriangle className="text-2xl text-base-yellow" />
          <span className="font-semibold text-base-yellow">You need energy to save a tweet</span>
        </div>
        <div className="mt-4 flex flex-col pl-1">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span>1. Copy the text below.</span>
              <CopyText text={`!energy ${toSubsocialAddress(address)}`} />
            </div>
            <div>
              2. Paste the text into the energy-bot channel in our{" "}
              <Link href="https://discord.com/invite/w2Rqy2M" openInNewTab>
                Discord.
              </Link>
            </div>
            <div>
              3. Wait until the bot finishes sending you energy (~10 seconds after the bot confirms
              your command).
            </div>
          </div>
        </div>
      </div>
    </Alert>
  );
}
