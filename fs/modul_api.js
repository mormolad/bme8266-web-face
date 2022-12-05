export async function callMyRpc(json) {
    const fetchResult = await fetch('/rpc/myRpc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: json,
    });
    const result = await fetchResult.json();
    return result;
};

async function callMyRpcGetValue(json) {
    const fetchResult = await fetch('/rpc/myRpcGetValue', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: json,
    });
    const result = await fetchResult.json();
    return result;
}


export async function getValueOutput(idSetting) {
    const jsonText = JSON.stringify(idSetting);
    let valueOutput = await callMyRpcGetValue(jsonText);
    return JSON.parse(valueOutput.message);
}