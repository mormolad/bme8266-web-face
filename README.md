# Прошивка ESP8266 в среде Mongoose OS для управления климатом теплицы или сити-фермы.

### Контроллер управляет 4мя каналами (суточный таймер, периодный таймер, работа по уставке). Настройка контроллера осуществляется через WEB-интерфейс. Телеметрию можно выводить на MQTT-сервер или телеграм бота.
Использованы технологии: JS, mJS, MQTT, API Telegram, RPC
---
#### в ходе написания прошивки познакомился с языком программирования JavaScript и API Telegram, разобрался в протоколе MQTT, узнал что такое RPC.
---
#### для заливки прошивки на ESP8266 можно воспользоваться инструкцией https://mongoose-os.com/docs/mongoose-os/quickstart/setup.md
---
#### в планах сделать дополнительный интерфейс, что бы можно было менять конфигшурацию контроллера онлайн
