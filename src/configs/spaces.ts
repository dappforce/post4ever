// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

const defaultP4eSpace = "10102";
const p4eSpace = process.env["NEXT_PUBLIC_P4E_SPACE"] || defaultP4eSpace;
export function getP4ESpace() {
  return p4eSpace;
}
