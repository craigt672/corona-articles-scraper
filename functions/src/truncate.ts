export default function truncate(str: string, wordsNumber: number) {
  return str.split(" ").splice(0, wordsNumber).join(" ").concat('...');
}
