import { $body, controllerBody, idOutput, valueOutput } from "./index.js";



export function getSetOfValue(typeRegulator) {

    let setOfValue = {
        periodTimer: { duration: 30, quantity: 4, stateSwitch: true, typeRegulator: "periodTimer", id: idOutput },
        dayTimer: { from: 63600, to: 82800, stateSwitch: true, typeRegulator: 'dayTimer', id: idOutput },
        setting: { setpoint: 25, stateSwitch: true, typeRegulator: 'setting', id: idOutput }
    }
    if (typeRegulator === 'periodTimer') {
        buildBody(setOfValue.periodTimer)
    }
    if (typeRegulator === 'dayTimer') {
        buildBody(setOfValue.dayTimer)
    }
    if (typeRegulator === 'setting') {
        buildBody(setOfValue.setting)
    }
}

function nameOutput(block) {
    let numberRelay = null
    if (block.id === 'output1') {
        numberRelay = '1'
    } else if (block.id === 'output2') {
        numberRelay = '2'
    } else if (block.id === 'output3') {
        numberRelay = '3'
    } else if (block.id === 'output4') {
        numberRelay = '4'
    }
    return `
<div id="nameOutput">
<h1 class="gc">Настройки режима реле ${numberRelay}.</h1>
</div>
`
}

function regulatorTypeSelection(block) {
    let regulatorType = {}
    if (block.typeRegulator === 'dayTimer') {
        regulatorType = { dayTimer: 'checked', periodTimer: '', setting: '' };
    } else if (block.typeRegulator === 'periodTimer') {
        regulatorType = { dayTimer: '', periodTimer: 'checked', setting: '' };
    } else if (block.typeRegulator === 'setting') {
        regulatorType = { dayTimer: '', periodTimer: '', setting: 'checked' };
    }
    return `
<div id= "regulatorType">
<form id="formTypeRegulator">
<input type="radio" name="answer" value="dayTimer" id="dayTimer" class="radio" ${regulatorType.dayTimer}> суточный таймер 
<input type="radio" name="answer" value="periodTimer" id="periodTimer" class="radio" ${regulatorType.periodTimer}> периодный таймер
<input type="radio" name="answer" value="setting" id="setting" class="radio" ${regulatorType.setting}> работа по уставке
</form>
</div>`
}

function dayTimer(block) {
    let valueSwitch = getValueSwitch(block);
    return `
    <div id="regulator" class="output">
    <h4>Включено с:</h4>
    <input type="time" id="setTimeFromOutput" value="${block.from}" step="1" class="time">
    <h4>Выключено с:</h4>
    <input type="time" id="setTimeToOutput" value="${block.to}" step="1" class="time"> 
    <h4>вкл/отк канал:</h4>
    <div class="row">
    <div class="rangeDiv"><input type="range" class="rangeOn" min="0" max="1" step="1" value=${valueSwitch} id="outputOn">
        <div id="outputOnValue" class="rangeValue"></div> <br>
    </div>
    </div>
    </div>
    `
}

function periodTimer(block) {
    let valueSwitch = getValueSwitch(block);
    return `
    <div id="output2" class="output">

    <h4>Количество включений в сутки:</h4>
    <div class="test">
        <div class="row">
            <div class="rangeDiv"><input class="range" type="range" min="0" max="25" step="1" id="outputQuantity"></div>
            <div class="valueRange">
                <div id="outputQuantityValue" class="rangeValue" value="${block.quantity}"></div>
            </div>
        </div>
    </div>
    <h4>Продолжительность включений в секундах:</h4><br>
    <div class="row">
        <div class="rangeDiv"><input class="range" type="range" min="0" max="3600" step="1" id="outputDuration"></div>
        <div class="valueRange">
            <div id="outputDurationValue" class="rangeValue" value="${block.duration}"></div>
        </div>
    </div><br>
    <h4>вкл/отк канал:</h4>
    <div class="row">
    <div class="rangeDiv"><input type="range" class="rangeOn" min="0" max="1" step="1" value=${valueSwitch} id="outputOn">
        <div id="outputOnValue" class="rangeValue"></div> <br>
    </div>
        </div>
    </div>
</div>`

}

function setting(block) {
    let valueSwitch = getValueSwitch(block);
    return ` <div id="output4" class="output">
    <h4>Уставка включения реле:</h4>
    <div class="test">
        <div class="row">
            <div class="rangeDiv"><input class="range" type="range" min="10" max="40" value="${block.value}" step="1" id="outputSet"></div>
            <div class="valueRange">
                <div id="outputSetValue" class="rangeValue"></div>
            </div>
        </div>
    </div>
    <h4>вкл/отк канал:</h4>
    <div class="row">
        <div class="rangeDiv"><input type="range" class="rangeOn" min="0" max="1" step="1" value=${valueSwitch} id="outputOn">
            <div class="valueRange">
                <div id="outputOnValue" class="rangeValue"></div> <br>
            </div>
        </div>
    </div>
</div>`
}

function button() {
    return ` <div id="button">
<input type="button" value="Сохранить" id="saveSettingOutput" class="button">
</div>
`
}

export async function buildBody(valueOutputCurrent) {
    let html = ''
    html += nameOutput(valueOutputCurrent)
    html += regulatorTypeSelection(valueOutputCurrent)
    if (valueOutputCurrent.typeRegulator === 'dayTimer') {
        html += dayTimer(valueOutputCurrent)
    } else if (valueOutputCurrent.typeRegulator === 'periodTimer') {
        html += periodTimer(valueOutputCurrent)
    } else if (valueOutputCurrent.typeRegulator === 'setting') {
        html += setting(valueOutputCurrent)
    }
    html += button()
    $body.innerHTML = html
    await controllerBody(valueOutputCurrent)

}


export function getSec(time) {
    const daySecs = 60 * 60 * 24;
    const date = new Date('01.01.1970 ' + time);
    const secsOfGreenwichDay = date.valueOf() / 1000;
    const wrappedSecsOfGreenwichDay = (daySecs + secsOfGreenwichDay) % daySecs;
    return wrappedSecsOfGreenwichDay;
}

export function getTimeSet(wrappedSecsOfGreenwichDay) {
    const date = new Date(wrappedSecsOfGreenwichDay * 1000);
    const localTimeText = date.toTimeString().slice(0, 8);
    console.log(localTimeText)
    return localTimeText;
}

function getValueSwitch(block) {
    if (block.stateSwitch === true) {
        return '1';
    } else if (block.stateSwitch === false) {
        return '0';
    } else {
        console.log('error state switch');
    }
}