[<img src="https://raw.githubusercontent.com/CrystalSystems/crystal-v2.0/refs/heads/main/assets/crystal-v2.0_logo.png?token=GHSAT0AAAAAADAFJJAXHWILCY3IGEY6MUCG2IA2ZJQ">](https://shedov.top/description-and-capabilities-of-crystal-v2-0/)


[![Members](https://img.shields.io/badge/dynamic/json?style=for-the-badge&label=&logo=discord&logoColor=white&labelColor=black&color=%23f3f3f3&query=$.approximate_member_count&url=https%3A%2F%2Fdiscord.com%2Fapi%2Finvites%2FENB7RbxVZE%3Fwith_counts%3Dtrue)](https://discord.gg/ENB7RbxVZE)&nbsp;[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge&logo=5865F2&logoColor=black&labelColor=black&color=%23f3f3f3)](https://github.com/CrystalSystems/crystal-v2.0/blob/main/LICENSE)<br/>
[![About_project](https://img.shields.io/badge/About_project-black?style=for-the-badge)](https://shedov.top/about-the-crystal-project)&nbsp;[![Documentation](https://img.shields.io/badge/Documentation-black?style=for-the-badge)](https://shedov.top/documentation-crystal/)&nbsp;[![Developer’s Diary](https://img.shields.io/badge/Developer’s_Diary-black?style=for-the-badge)](https://shedov.top/category/crystal/crystal-developers-diary/)

**Architecture:** <br/>
SPA, REST API, FSD.

**Composition:** <br/>
[Full code](https://github.com/CrystalSystems/crystal-v2.0/) | Package.json: [frontend](https://github.com/CrystalSystems/crystal-v2.0/blob/main/frontend/package.json) | [backend](https://github.com/CrystalSystems/crystal-v2.0/blob/main/backend/package.json)<br/>

**Structure:** <br/>
MongoDB v8.0.4.<br/>
Express.js v4.21.2.<br/>
React v19.0.0.<br/>
Node.js v24.0.2.<br/>
NPM v11.3.0.<br/>
PM2 v5.4.3.<br/>
Vite v6.1.0.<br/>

Functionally, this version is almost completely identical to [CRYSTAL v1.0](https://shedov.top/description-and-capabilities-of-crystal-v1-0/), but has a number of key improvements:

1. Mongoose has been removed and replaced by [native driver](https://www.npmjs.com/package/mongodb) MongoDB.

2. [Data schemas](https://github.com/CrystalSystems/crystal-v2.0/blob/main/backend/src/modules/user/user.schema.js)  for all collections, defined using the standard JSON Schema and [initialized](https://github.com/CrystalSystems/crystal-v2.0/blob/main/backend/src/core/engine/db/initializeCollections.js) in MongoDB using the [$jsonSchema](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema).

3. To search the content (this component will be published in the [repository](https://github.com/CrystalSystems/crystal-v2.0) at a later date), MongoDB full-text search is used based on the [$text](https://www.mongodb.com/docs/manual/reference/operator/query/text/) operator.

4. Added user status (online/offline). The logic is implemented using WebSocket ([frontend](https://github.com/CrystalSystems/crystal-v2.0/blob/main/frontend/src/shared/hooks/useWebSocket/useWebSocket.js) | [backend]([</a>](https://github.com/CrystalSystems/crystal-v2.0/blob/main/backend/src/core/engine/web/websocket.js))).

5. Multer has been replaced by [Sharp](https://github.com/CrystalSystems/crystal-v2.0/blob/main/backend/src/shared/utils/sharp/sharp-upload.js).

6. Added the ability to specify gender.

7. On the user page, a section has been added with detailed information about the user (gender, registration date, date of user data update).

8. Added a user interface setting that allows you to hide all GIFs.

9. Added user privacy setting that allows you to hide gender.

10. The security system complies with [CRYSTAL v1.0  (Production)](https://shedov.top/description-and-capabilities-of-crystal-v1-0/#paragraph_7).

**⚠️ Before using [CRYSTAL v2.0](https://github.com/CrystalSystems/crystal-v2.0) or its code in a production environment, it is strongly recommended to carefully review the implementation and assess any potential cybersecurity risks.**<br/>

<h3 align="center">CRYSTAL is tested on</h3>
<p align="center">
  <a href="https://www.browserstack.com/">
    <img src="https://raw.githubusercontent.com/CrystalSystems/crystal-v2.0/73d3677003aaa2a004895329032cc2704efbdd59/assets/browserstack_logo.svg?token=ALKCJMPGHRGTCBM2EA23G3DJADS4E" width="290" />
  </a>
</p>

[![SHEDOV.TOP](https://img.shields.io/badge/SHEDOV.TOP-black?style=for-the-badge)](https://shedov.top/) 
[![CRYSTAL](https://img.shields.io/badge/CRYSTAL-black?style=for-the-badge)](https://crysty.ru/AndrewShedov)
[![Discord](https://img.shields.io/badge/Discord-black?style=for-the-badge&logo=discord&color=black&logoColor=white)](https://discord.gg/ENB7RbxVZE)
[![Telegram](https://img.shields.io/badge/Telegram-black?style=for-the-badge&logo=telegram&color=black&logoColor=white)](https://t.me/ShedovTop)
[![X](https://img.shields.io/badge/%20-black?style=for-the-badge&logo=x&logoColor=white)](https://x.com/AndrewShedov)
[![VK](https://img.shields.io/badge/VK-black?style=for-the-badge&logo=vk)](https://vk.com/ShedovTop)
[![VK Video](https://img.shields.io/badge/VK%20Video-black?style=for-the-badge&logo=vk)](https://vkvideo.ru/@ShedovTop)
[![YouTube](https://img.shields.io/badge/YouTube-black?style=for-the-badge&logo=youtube)](https://www.youtube.com/@AndrewShedov)
 
