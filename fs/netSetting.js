import { getValueOutput, callMyRpc } from './modul_api.js'

const $setNameAp = document.getElementById('nameAp');
const $setPasswordAp = document.getElementById('passwordAp');
const $setNameSta = document.getElementById('nameSta');
const $setPasswordSta = document.getElementById('passwordSta');
const $setIpMqtt = document.getElementById('ipMqtt');
const $saveSetting = document.getElementById('saveSetting');
const $result = document.getElementById('result');

$saveSetting.addEventListener('click', onGeneralSettingClick);

async function onGeneralSettingClick() {
    const setNet = {
        id: 'setNet',
        nameAp: $setNameAp.value,
        passwordAp: $setPasswordAp.value,
        nameSta: $setNameSta.value,
        passwordSta: $setPasswordSta.value,
        ipMqtt: $setIpMqtt.value,
    };
    await callMyRpc(JSON.stringify(setNet));
}



async function writeValue(idSetting) {
    const valueOutput = await getValueOutput(idSetting);
    $setNameAp.value = valueOutput.nameAp;
    $setPasswordAp.value = valueOutput.passwordAp;
    $setNameSta.value = valueOutput.nameSta;
    $setPasswordSta.value = valueOutput.passwordSta;
    $setIpMqtt.value = valueOutput.ipMqtt;

}

writeValue('generalSettings');