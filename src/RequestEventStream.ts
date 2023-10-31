/* eslint-disable */
import { workspace } from "vscode";
import { FetchStream } from "./FetchStream";
import AbortController from "abort-controller";

let abortController = new AbortController();

export async function stopEventStream() {
    abortController.abort();
}

export async function postEventStream(prompt: string, msgCallback: (data: string) => any, doneCallback: () => void, errorCallback: (err: any) => void) {
    const serverAddress = workspace.getConfiguration("CodeShell").get("ServerAddress") as string;
    const maxtokens = workspace.getConfiguration("CodeShell").get("ChatMaxTokens") as number;
    const modelname = workspace.getConfiguration("CodeShell").get("LLMModel") as string;
    
    var uri = "";
    var body = {};

    uri = "/v1/chat/completions"

    console.log(modelname)
    console.log(serverAddress + uri)

    body = {
        "model": modelname,
        "messages": [{ "role": 'user', "content": prompt }],
        "max_tokens": maxtokens,
        "stream": true
    };
    
    abortController = new AbortController();
    new FetchStream({
        url: serverAddress + uri,
        requestInit: {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'EMPTY'
            },
            body: JSON.stringify(body),
            signal: abortController.signal
        },
        onmessage: msgCallback,
        ondone: doneCallback,
        onerror: errorCallback
    });

}