load('api_mqtt.js');
load('api_timer.js');
load('api_sys.js');
load('api_config.js');
load('api_rpc.js');
load('api_gpio.js');
load('api_bme280.js');

let controllerChannel = {
    output1: {
        pin: 12,
        stateRelay: false,
    },
    output2: {
        pin: 14,
        stateRelay: false,
    },
    output3: {
        pin: 13,
        stateRelay: false,
    },
    output4: {
        pin: 15,
        stateRelay: false,
    },
};

GPIO.setup_output(controllerChannel.output1.pin, 0);
GPIO.setup_output(controllerChannel.output2.pin, 0);
GPIO.setup_output(controllerChannel.output3.pin, 0);
GPIO.setup_output(controllerChannel.output4.pin, 0);

let bme = BME280.createI2C(0x76);
let bmeValue = null;
let bmePressure = null;
let bmeTemperature = null;
let bmeHumidity = null;

function output(id) {
    let configurationOutput = JSON.parse(Cfg.get(id));
    let stateRegulator = getStateRegulator(configurationOutput);
    let relayStateAfterUpdate = null;
    let pinRelay = null;
    if (id === 'output1') {
        relayStateAfterUpdate = updateState(stateRegulator, controllerChannel.output1.stateRelay);
        pinRelay = controllerChannel.output1.pin;
    } else if (id === 'output2') {
        relayStateAfterUpdate = updateState(stateRegulator, controllerChannel.output2.stateRelay);
        pinRelay = controllerChannel.output2.pin;
    } else if (id === 'output3') {
        relayStateAfterUpdate = updateState(stateRegulator, controllerChannel.output3.stateRelay);
        pinRelay = controllerChannel.output3.pin;
    } else if (id === 'output4') {
        relayStateAfterUpdate = updateState(stateRegulator, controllerChannel.output4.stateRelay);
        pinRelay = controllerChannel.output4.pin;
    }


    if (relayStateAfterUpdate === true) {
        if (stateRegulator === true) {
            GPIO.write(pinRelay, 1);
        } else if (stateRegulator === false) {
            GPIO.write(pinRelay, 0);
        } else {
            print('error');
        }
        let topic = '/' + configurationOutput.id;
        let msg = JSON.stringify(topic) + ': ' + JSON.stringify(stateRegulator);
        MQTT.pub(topic, msg, 0);
        if (id === 'output1') {
            controllerChannel.output1.stateRelay = stateRegulator;
        } else if (id === 'output2') {
            controllerChannel.output2.stateRelay = stateRegulator;
        } else if (id === 'output3') {
            controllerChannel.output3.stateRelay = stateRegulator;
        } else if (id === 'output4') {
            controllerChannel.output4.stateRelay = stateRegulator;
        }
    }
};

function getStateDayTimer(configurationOutput) {
    function toMoreFrom() {
        let timeNow = Timer.now() % 86400;
        if (timeNow > configurationOutput.from && timeNow < configurationOutput.to) {
            return true;
        } else if (timeNow < configurationOutput.from || timeNow > configurationOutput.to) {
            return false;
        }
    };

    function toLessFrom() {
        let timeNow = Timer.now() % 86400;
        if (timeNow > configurationOutput.to && timeNow < configurationOutput.from) {
            return false;
        } else if (timeNow < configurationOutput.to || timeNow > configurationOutput.from) {
            return true;
        }
    };

    if (configurationOutput.from === configurationOutput.to) {
        return true;
    } else if (configurationOutput.to > configurationOutput.from) {
        return toMoreFrom();
    } else if (configurationOutput.to < configurationOutput.from) {
        return toLessFrom();
    };


};

function getStateSettingRegulator(configurationOutput) {
    if (configurationOutput.stateSwitch === true) {
        if (bmeTemperature <= configurationOutput.setpoint) {
            return true;
        } else if (bmeTemperature > (configurationOutput.setpoint - 0.5)) {
            return false;
        }
    } else {
        return false;
    }
};

function getStatePeriodTimer(configurationOutput) {
    let timeNow = Timer.now();
    let segment = timeNow % (86400 / configurationOutput.quantity);
    if (configurationOutput.quantity === 25) {
        return true;
    } else if (segment <= configurationOutput.duration) {
        return true;
    } else if (segment > configurationOutput.duration) {
        return false;
    };
};

function getStateRegulator(configurationOutput) {
    if (configurationOutput.typeRegulator === 'dayTimer') {
        return getStateDayTimer(configurationOutput);
    } else if (configurationOutput.typeRegulator === 'periodTimer') {
        return getStatePeriodTimer(configurationOutput);
    } else if (configurationOutput.typeRegulator === 'setting') {
        return getStateSettingRegulator(configurationOutput);
    }

};

function updateState(newState, oldState) {
    if (oldState !== newState) {
        return true;
    } else {
        return false;
    }
};



RPC.addHandler('myRpc', function(jsonText) {
    let textSaved = JSON.stringify(jsonText);

    if (jsonText.id === 'output1') {
        Cfg.set({ output1: textSaved });
    } else if (jsonText.id === 'output2') {
        Cfg.set({ output2: textSaved });
    } else if (jsonText.id === 'output3') {
        Cfg.set({ output3: textSaved });
    } else if (jsonText.id === 'output4') {
        Cfg.set({ output4: textSaved });
    } else if (jsonText.id === 'setNet') {
        let setNet = jsonText;
        print(setNet);
        Cfg.set({ wifi: { ap: { ssid: setNet.nameAp } } });
        Cfg.set({ wifi: { ap: { pass: setNet.passwordAp } } });
        Cfg.set({ wifi: { sta: { ssid: setNet.nameSta } } });
        Cfg.set({ wifi: { sta: { pass: setNet.passwordSta } } });
        Cfg.set({ mqtt: { server: setNet.ipMqtt } });
    };
    return jsonText;
});

RPC.addHandler('myRpcGetValue', function(idSetValue) {
    if (idSetValue === 'generalSettings') {

        return {
            message: JSON.stringify({
                nameAp: Cfg.get('wifi.ap.ssid'),
                passwordAp: Cfg.get('wifi.ap.pass'),
                nameSta: Cfg.get('wifi.sta.ssid'),
                passwordSta: Cfg.get('wifi.sta.pass'),
                ipMqtt: Cfg.get('mqtt.server')
            })
        };
    } else if (idSetValue === 'output1') {
        return { message: Cfg.get('output1') };
    } else if (idSetValue === 'output2') {
        return { message: Cfg.get('output2') };
    } else if (idSetValue === 'output3') {
        return { message: Cfg.get('output3') };
    } else if (idSetValue === 'output4') {
        return { message: Cfg.get('output4') };
    }
});


let tempFake = 0;

Timer.set(5 * 1000, true, function() {
    tempFake = tempFake + 1;
    //bmePressure = bme.readPress()
    //bmeTemperature = bme.readTemp();
    bmeTemperature = 22 + Math.sin(tempFake);
    bmeHumidity = bme.readHumid();
    MQTT.pub('/temperature', JSON.stringify(bmeTemperature), 0);
    //MQTT.pub('/humidity', JSON.stringify(bmeHumidity), 0);
    //MQTT.pub('/humidity', JSON.stringify(bmePressure), 0);
    output('output1');
    output('output2');
    output('output3');
    output('output4');
}, null);