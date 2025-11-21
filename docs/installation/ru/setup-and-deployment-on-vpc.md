# Настройка и развертывание на VPC

1. Создать **.env переменные**, следуя соответствующим примерам для [frontend](https://github.com/CrystalSystems/crystal-v2.0/tree/main/docs/examples/env/frontend/env) и [backend](https://github.com/CrystalSystems/crystal-v2.0/tree/main/docs/examples/env/backend/env).

2. Выполнить пункты 3-8, из [документации CRYSTAL v1.0](https://shedov.top/ru/dokumentaciya-crystal-v1-0/). В инструкциях из документации, отличаются некоторые **.env переменные**, так как в CRYSTAL v2.0 они более расширенные, но в целом инструкции подходят для CRYSTAL v2.0.
Загрузку файлов проекта на ВМ в VPC, можно выполнять не через GitHub, а через SFTP в FileZilla. Нельзя переносить папки **node_modules** с локального ПК на ВМ, так как будут критические ошибки из-за bcrypt и т.д.

3. Создать админа в базе данных, и прописать значения в соответствующих **.env переменных**, для выполнения безопасного подключения к бд, через `mongodb://${USER}:${PASSWORD}@${HOST}:${PORT}/?authSource=${AUTH_SOURCE}`.

4. Добавить в конфигурацию Nginx правило <code>location /ws</code> для поддержки WebSocket, следуя [данному примеру](https://github.com/CrystalSystems/crystal-v2.0/blob/fbe94fa25ab8765f036dbc8311a67b9aaac47608/docs/examples/nginx/sites-available/crystal#L38).


