// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

export const trimMiddleString = (text?: string, numberStringsKept = 5) => {
  if (!text) return "";
  const result = `${text.slice(0, numberStringsKept)}...${text.slice(
    text.length - numberStringsKept,
  )}`;

  return result;
};

export const urlMatcher = (text: string, urlToMatch: string) => {
  let isMatch = false;

  if (text.length) {
    isMatch = text.startsWith(urlToMatch);
  }

  return isMatch;
};
