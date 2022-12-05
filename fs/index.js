const urlParams = new URLSearchParams(location.search);
export const idOutput = urlParams.get('id');

export const $body = document.getElementById('body')
import { getTimeSet, buildBody, getSec, getSetOfValue } from './templates.js'
import { getValueOutput, callMyRpc } from './modul_api.js'


let $outputOn = null

let $setTimeFromOutput = null
let $setTimeToOutput = null

let $outputQuantityValue = null
let $outputDurationValue = null
let $outputQuantity = null
let $outputDuration = null

let $outputSetValue = null
let $outputSet = null

let $dayTimerRadio = null
let $periodTimerRadio = null
let $settingRadio = null



export let valueOutput = await getValueOutput(idOutput);
await buildBody(valueOutput);


export async function controllerBody(valueOutput) {
    console.log('value output in controllerBody', valueOutput)
    if (valueOutput.typeRegulator === 'dayTimer') {
        $setTimeFromOutput = document.getElementById('setTimeFromOutput');
        $setTimeToOutput = document.getElementById('setTimeToOutput');
        $setTimeFromOutput.value = getTimeSet(valueOutput.from);
        $setTimeToOutput.value = getTimeSet(valueOutput.to);
        $setTimeFromOutput.addEventListener('change', () => { valueOutput.from = getSec($setTimeFromOutput.value) })
        $setTimeToOutput.addEventListener('change', () => { valueOutput.to = getSec($setTimeToOutput.value) })
    } else if (valueOutput.typeRegulator === 'periodTimer') {
        $outputQuantityValue = document.getElementById('outputQuantityValue');
        $outputDurationValue = document.getElementById('outputDurationValue');
        $outputQuantity = document.getElementById('outputQuantity');
        $outputDuration = document.getElementById('outputDuration');
        $outputQuantityValue.innerText = valueOutput.quantity;
        $outputQuantity.value = valueOutput.quantity;
        $outputDurationValue.innerText = valueOutput.duration;
        $outputDuration.value = valueOutput.duration;
        $outputQuantity.addEventListener('change', () => {
            $outputQuantityValue.innerHTML = $outputQuantity.value
            valueOutput.quantity = Number($outputQuantity.value)
        });
        $outputDuration.addEventListener('change', () => {
            $outputDurationValue.innerHTML = $outputDuration.value
            valueOutput.duration = Number($outputDuration.value)
        });
    } else if (valueOutput.typeRegulator === 'setting') {
        $outputSet = document.getElementById('outputSet');
        $outputSetValue = document.getElementById('outputSetValue');
        console.log(valueOutput.setpoint)
        $outputSetValue.innerText = valueOutput.setpoint;
        $outputSet.value = valueOutput.setpoint;
        $outputSet.addEventListener('change', () => {
            $outputSetValue.innerHTML = $outputSet.value
            valueOutput.setpoint = Number($outputSet.value)
        });
    }

    $outputOn = document.getElementById('outputOn');
    switchOutputChange();
    $outputOn.addEventListener('change', switchOutputChange);
    $outputOn = document.getElementById('outputOn');

    $dayTimerRadio = document.getElementById('dayTimer');
    $periodTimerRadio = document.getElementById('periodTimer');
    $settingRadio = document.getElementById('setting');

    $dayTimerRadio.addEventListener('click', () => { getSetOfValue('dayTimer') })
    $periodTimerRadio.addEventListener('click', () => { getSetOfValue('periodTimer') })
    $settingRadio.addEventListener('click', () => { getSetOfValue('setting') })

    const $saveSettingOutput = document.getElementById('saveSettingOutput');
    $saveSettingOutput.addEventListener('click', () => {
        let valueWrited = callMyRpc(JSON.stringify(valueOutput));
    });
}

async function switchOutputChange() {
    const $outputOnValue = document.getElementById('outputOnValue');
    if ($outputOn.value == 1) {
        $outputOnValue.innerHTML = "on";
        valueOutput.stateSwitch = true
    } else {
        $outputOnValue.innerHTML = "off";
        valueOutput.stateSwitch = false
    }
};