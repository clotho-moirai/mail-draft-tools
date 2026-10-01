// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { formatPastedMail, quoteText } from './textTools';

// 選択なし → 全文、選択あり → 選択範囲(複数選択対応)
function getTargetRanges(editor: vscode.TextEditor, expandToLines: boolean): vscode.Range[] {
	const doc = editor.document;
	const selections = editor.selections.filter(s => !s.isEmpty);

	if (selections.length === 0) {
		return [new vscode.Range(doc.positionAt(0), doc.positionAt(doc.getText().length))];
	}
	return selections.map(s => {
		if (!expandToLines) {
			return new vscode.Range(s.start, s.end);
		}
		// 行頭挿入の処理なので、選択を行全体に広げる
		let endLine = s.end.line;
		if (s.end.character === 0 && endLine > s.start.line) {
			endLine--; // 次行の行頭で終わっている場合、その行は含めない
		}
		return new vscode.Range(
			new vscode.Position(s.start.line, 0),
			doc.lineAt(endLine).range.end
		);
	});
}

async function transform(fn: (text: string) => string, expandToLines: boolean) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage('アクティブなエディタがありません。');
		return;
	}
	const ranges = getTargetRanges(editor, expandToLines);
	await editor.edit(eb => {
		for (const r of ranges) {
			eb.replace(r, fn(editor.document.getText(r)));
		}
	});
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "mail-draft-tools" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	//const disposable = vscode.commands.registerCommand('mail-draft-tools.helloWorld', () => {
	// The code you place here will be executed every time your command is executed
	// Display a message box to the user
	//	vscode.window.showInformationMessage('Hello World from Mail draft tools!');
	//});

	//context.subscriptions.push(disposable);

	context.subscriptions.push(
		vscode.commands.registerCommand('info.kagura-c.formatPastedMail', () =>
			transform(formatPastedMail, false)),
		vscode.commands.registerCommand('info.kagura-c.quotedText', () =>
			transform(quoteText, true))
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
