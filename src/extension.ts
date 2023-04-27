// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// const FS = require('fs') 
import { readFileSync } from 'fs';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	
    let codePanel:vscode.WebviewPanel;
	let hasPanel = false;
	
	let opt = vscode.commands.registerCommand('code-optimization.opt', () => {
		// vscode.window.showInformationMessage('打开面板啦!');
         if(!hasPanel){
			initWebview()
			return
		 }
		  
	});


	let doopt = vscode.commands.registerCommand('code-optimization.doopt', () => {
		 
		
		let sourceCode :string | undefined;

		const selection = vscode.window.activeTextEditor?.selection;
		if(selection!==undefined && !selection?.isEmpty){
			 
			const sr = new vscode.Position(selection.start.line,selection.start.character);
			const er = new vscode.Position(selection.end.line,selection.end.character);
			const range = new vscode.Range(sr,er);
			sourceCode = vscode.window.activeTextEditor?.document.getText(range);
		}else{
			sourceCode = vscode.window.activeTextEditor?.document.getText();
		}
		
		if(!sourceCode){
			vscode.window.showInformationMessage('请选中需要优化的代码片段!');
			return 
		}
		
         if(!hasPanel){
			initWebview()
		 }
		 
		 codePanel.webview.postMessage({ 
			type: 'opt' ,
			content:sourceCode
		});
	
	});


	function initWebview(){
		hasPanel = true
		codePanel = vscode.window.createWebviewPanel(
			'code-optimization-result', // Identifies the type of the webview. Used internally
			'问天AI助手', // Title of the panel displayed to the user
			vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
			{
				enableScripts:true
			} 
		  );

		  codePanel.onDidDispose(()=>{
			hasPanel=false
		  });
		codePanel.webview.html = getWebContents();
	 
			
		codePanel.webview.onDidReceiveMessage(
			message => {
			  switch (message.command) {
				case 'alert':
				  vscode.window.showErrorMessage(message.text);
				  
				  return;
			  }
			},
			undefined,
			context.subscriptions
		  )
	}

	function getWebContents(){
		return `<!DOCTYPE html>
		<html lang="en">
		
		<head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title></title>
		  <style>
			html,
			body {
			  height: 100%;
			  overflow-x: hidden;
			}
		  </style>
		</head>
		
		<body>
			 <iframe id="mysite" style="height:100vh;width:100vw" src="https://www.h3d.cc" ></iframe>
		
		  <script>
		
			   const mysite = document.getElementById('mysite')
				
				window.onmessage= (event)=>{
				  const data = event.data;
				  if(!event.origin.includes('vscode-webview')){
					   return
				  }
				  mysite.contentWindow.postMessage(data,"*")
				}
		
		  </script>
		</body>
		
		</html>`
	}


	context.subscriptions.push(opt);
	context.subscriptions.push(doopt);
	
}



// This method is called when your extension is deactivated
export function deactivate() {}
