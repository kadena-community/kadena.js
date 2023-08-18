import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "kadena" is now active!');

	let disposable = vscode.commands.registerCommand('kadena.helloWorld', () => {
		vscode.window.showInformationMessage('Hello from Kadena!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
