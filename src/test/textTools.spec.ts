import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { formatPastedMail, quoteLine } from '../textTools';

test('formatPastedMail', () => {
    assert.equal(formatPastedMail('A\n \n\nB'), 'A\n\nB');
    assert.equal(formatPastedMail('A\n\n\nB'), 'A\n\nB');
    assert.equal(formatPastedMail('A\n \n\n\n\nB'), 'A\n\n\nB'); // 仕様どおり。下の注意参照
    assert.equal(formatPastedMail('A\r\n \r\n\r\nB'), 'A\n\nB'); // CRLF
});

test('quoteLine', () => {
    const cases: [string, string][] = [
        ['', '>'],                    // 空行
        ['   ', '>'],                 // 空白のみ
        ['こんにちは', '> こんにちは'],
        ['  字下げ', '>   字下げ'],       // 行頭の空白は保持
        ['> 引用', '>> 引用'],
        ['>引用', '>> 引用'],           // 半角スペースを補う
        ['>>引用', '>>> 引用'],
        ['> > 引用', '>>> 引用'],       // ">" 間の空白を削除
        ['＞引用', '>> 引用'],          // 全角を半角に
        ['＞ ＞ 引用', '>>> 引用'],
        ['>', '>>'],                  // ">" のみ
        ['> ', '>>'],                 // 末尾スペース削除
        ['> >  ', '>>>'],
        ['a ＞ b', '> a ＞ b'],         // 本文中の全角 ＞ は触らない
    ];
    for (const [input, expected] of cases) {
        assert.equal(quoteLine(input), expected, `input: ${JSON.stringify(input)}`);
    }
});