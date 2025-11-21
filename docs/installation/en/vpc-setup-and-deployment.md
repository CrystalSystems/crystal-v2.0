# VPC Setup and Deployment

1. Create **.env variables** following the corresponding examples for [frontend](https://github.com/CrystalSystems/crystal-v2.0/tree/main/docs/examples/env/frontend/env) and [backend](https://github.com/CrystalSystems/crystal-v2.0/tree/main/docs/examples/env/backend/env).

2. Follow steps 3-8 from [CRYSTAL v1.0 documentation](https://shedov.top/documentation-crystal-v1-0/). In the instructions from the documentation, some **.env variables** differ, since in CRYSTAL v2.0 they are more advanced, but in general the instructions are suitable for CRYSTAL v2.0.
Uploading project files to a VM in a VPC can be done not through GitHub, but through SFTP in FileZilla. You cannot transfer the **node_modules** folders from the local PC to the VM, as there will be critical errors due to bcrypt, etc.

3. Create an admin in the database, and set the values ​​in the corresponding **.env variables** to make a secure connection to the database via `mongodb://${USER}:${PASSWORD}@${HOST}:${PORT}/?authSource=${AUTH_SOURCE}`.

4. Add the <code>location /ws</code> rule to the Nginx configuration to support WebSocket, following [this example](https://github.com/CrystalSystems/crystal-v2.0/blob/1fa7e349aef941259801ebacdcfd15d21bc25a7c/docs/examples/nginx/sites-available/crystal#L38).