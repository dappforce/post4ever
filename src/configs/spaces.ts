const defaultP4eSpace = "10102";
const p4eSpace = process.env["NEXT_PUBLIC_P4E_SPACE"] || defaultP4eSpace;
export function getP4ESpace() {
  return p4eSpace;
}
