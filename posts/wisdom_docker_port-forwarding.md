---
title: "Dockerfile 에서 포트포워딩을 제대로 했는데 웹앱에 접속이 안되는 문제"
date: "2023-12-31"
category: "wisdom"
tags: ["wisdom", "docker", "port-forwarding"]
---

## 문제의 발단

![](https://i.imgur.com/WGuhidr.png)

요즘 새로운 사이드 프로젝트에서 도커를 도입해보려고 하고 있다. (React, Vite, Typescript 환경) 웹앱을 도커 환경 내에서 실행을 시킨 뒤, 포트포워딩을 해서 로컬 환경에서 접속이 되는지를 확인하려 했는데, 도커 파일을 작성을 하고 컨테이너를 실행키는 것까지는 문제가 없었으나 브라우저로 접속해보니 웬걸 서버에 엑세스가 안된다.

#### 사용했던 Dockerfile

```bash
# image node
FROM node:18

# set working diractory
WORKDIR /app

# copy package.json in working diractory
COPY package.json .

# install node module
RUN yarn install

# open port
EXPOSE 5173

# start front-end server
CMD ["yarn", "dev"]
```

#### Docker 실행 명령어

```bash
docker run -d -p 3000:5173 --name wisdom-frontend-container wisdom-frontend-image
```

## 한 번 해결해보자

![](https://i.imgur.com/cJN8Dk6.png)

왜지 생각하다가, 도커 컨테이너 환경에서 커맨드라인을 띄워 내부를 확인해봐야겠다고 생각했다. 이런.. `Dockerfile`에서 `package.json`만 COPY했기 때문에 컨테이너 내부에는 React 라이브러리 자체가 존재하지 않았다. 그래서 vite는 실행되었지만 전달할 페이지가 없었기 때문에 브라우저에서 접속이 안된 게 아닐까 싶었다.

```bash
FROM node:18
WORKDIR /app
COPY package.json .
COPY . . # copy react app in working directory (추가)
RUN yarn install
EXPOSE 5173
CMD ["yarn", "dev"]
```

도커 파일을 위와 같이 수정했고(워킹 디렉토리에 리액트 앱을 복사시키는 커맨드를 추가했다), 다시 워킹 디렉토리를 확인해보자.

![](https://i.imgur.com/fTgsaPM.png)

오케이, React 앱 자체는 도커 환경 내에 복사가 되었다.

![](https://i.imgur.com/WGuhidr.png)

그러나, 웹브라우저에서는 아까와 똑같은 결과가 나왔다.. 아예 터미널에서 `curl` 명령어로 서버와 통신을 확인해보자.

### curl 명령어로 확인한 결과

```bash
curl http://localhost:3000/
curl: (56) Recv failure: Connection reset by peer
```

음? 연결이 피어로부터 초기화되었다는 메시지가 뭔가 수상하다. 아예 열려있지 않은 포트(3001)로 `curl`명령어를 시도하면, 아래와 같은 결과가 나올터.

```bash
curl http://localhost:3001/
curl: (7) Failed to connect to localhost port 3001 after 5 ms: Couldn't connect to server
```

반대로 도커 컨테이너에 접속해서 `curl`을 실행하면, 다음과 같이 제대로 결과물이 나온다. 컨테이너 내부의 IP 설정이 잘 못된 건가보네.

### 도커 컨테이너 내부에서 curl 명령어로 확인한 결과

```bash
docker exec -it wisdom-frontend-container bash
root@2a25fb61b49b:/app# curl http://localhost:5173

<!doctype html>
<html lang="en">
  <head>
    <script type="module">
import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
</script>

    <script type="module" src="/@vite/client"></script>

    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`docker ps -l`로 포트를 확인해봐도, docker 쪽에서는 외부 공개로 IP(0.0.0.0:3000->5173)가 잘 설정되어있는 걸 확인할 수 있었다.

```bash
docker ps -l
CONTAINER ID   IMAGE                   COMMAND                  CREATED              STATUS              PORTS                    NAMES
c873a65ebcb4   wisdom-frontend-image   "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:3000->5173/tcp   wisdom-frontend-container
```

## 해결책

이것저것 해보다가 알게 되었는데, 와... 알고보니, `vite.config.ts`의 문제였다. vite default host는 localhost로 되어있기 때문에 외부에서의 엑세스가 불가능했던 것.vite의 host를 `0.0.0.0`으로 설정해줬더니 로컬 환경에서 제대로 접속이 됐다. ([참고 자료](https://stackoverflow.com/questions/54138091/docker-for-mac-docker-compose-cannot-access-containers-using-localhost))

### vite.config.ts 파일

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
```

vite의 host 정보는 위와 같이 설정할 수 있다.

## 결과

![](https://i.imgur.com/1tdKcnz.png)

웹 브라우저에서 확인해보니 제대로 도커 내부의 앱에 연결되는 걸 확인할 수 있었다. 기존에는 도커 컨테이너 내부의 앱이 `Vite` 환경에서 로컬 호스트(127.0.0.1)에 대해서 대기하고 있었기 때문에 외부에서 들어오는 포트포워딩이 차단되었던 듯. 처음으로 도커를 만지면서 덕분에 재밌는 경험을 했다 ^\_^..
