/** メール貼り付け後の余分な空行を整える(仕様どおり2回置換) */
export function formatPastedMail(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replaceAll('\n \n\n', '\n\n')
    .replaceAll('\n\n', '\n');
}

/** 1行を引用形式にする */
export function quoteLine(line: string): string {
  // 行頭の ">" / "＞" の連なり(間の空白は許容)と、その残りに分ける
  const m = line.match(/^([>＞](?:[ \t\u3000]*[>＞])*)(.*)$/);
  const markers = m ? m[1].replace(/[ \t\u3000]/g, '').replace(/＞/g, '>') : '';
  const rest = m ? m[2] : line;
  const prefix = '>'.repeat(markers.length + 1);

  // ">" と空白しかない行: 末尾スペースなし
  if (rest.trim() === '') {
    return prefix;
  }
  // 引用記号がない行は常に "> "、ある行は最後の ">" の後にスペースがなければ補う
  const needSpace = markers.length === 0 || rest[0] !== ' ';
  return prefix + (needSpace ? ' ' : '') + rest;
}

export function quoteText(text: string): string {
  return text.replace(/\r\n/g, '\n').split('\n').map(quoteLine).join('\n');
}