---
title: "습관을 추적할 수 있는 웹 어플리케이션, 'Wisdom' 프로젝트 기획"
date: "2024-01-01"
category: "Wisdom Project"
tags: ["wisdom", "project", "habit-tracker"]
---

## 계기

작년 10월쯤부터 `Front Insights` 블로그를 만들면서 `SEO`, `Design` 등에 대해서 경험할 수 있었던 게 좋았지만, 비지니스 로직 관련해서는 크게 고민할 게 없어서 아쉬웠다. 이제는 **개발 블로그를 어느 정도 완성을 시켰으니, 블로그가 아닌 새로운 사이드 프로젝트를 시작해야겠다 생각했다.** 이번에도 내게 필요한 걸 직접 만들어볼까 한다. 내게 필요했던 것, 혹은 불편했던 것은 어떤 게 있을까?

### OKR 진척을 관리할 때 사용했던 스프레드 시트

![](https://i.imgur.com/kiOWDbV.png)_OKR을 작성하던 스프레드 시트_

개인적으로 이전에 [OKR](http://localhost:3001/posts/retro_202311) 을 진행하면서 가장 아쉬웠던 건, 모든 기록이 스프레드 시트에서 이뤄졌다는 것. 그래서인지 매일 공부한 항목에 대해서 직접 셀의 색깔을 바꿔서 시각적인 표시를 남긴다든지 했던 게 불편했다(함수나 조건식을 만들 수는 있었겠지만). 게다가 카테고리별 상세 내용을 작성하기 위해서는 다른 시트로 옮겨가면서 작성해야 하는 것도 귀찮게 느껴졌다. **특히 제일 아쉬운 것은 스프레드 시트는 마크다운을 사용할 수 없다는 것**...😇 그래서인지, **_글에 대한 가독성이 낮아, 기록된 글을 나중에 다시 확인하기가 쉽지 않았다. OKR 진척을 관리할 수 있으면서, 동시에 다시 읽힐 수 있는 정보를 남길 수 있으면 최고일 텐데 말이다._** 여기서 `zenn`의 `scraps` 기능처럼 기록을 남겨, 정보를 아카이브화 할 수 있는 형태가 떠올랐다.

![](https://i.imgur.com/rtoTjyj.png)_Zenn 의 scraps 기능. 일반적인 블로그 글보다는 덜 무겁지만, twitter 보다는 깊은 내용을 작성할 수 있다_

OKR 관리는 앞으로도 계속해서 할 거니, 이번에 직접 서비스를 만들어서 그곳에다 OKR 관련 기록을 하게 되면 스토리가 딱 예쁠 것 같았다. 그런 의미로 이번에는 **_습관에 대한 TODO 를 관리할 수 있으면서 각 습관 별 공부 한 내용을 기록할 수 있는 웹 어플리케이션(Wisdom)_**을 만들어 볼까 한다. (이 프로젝트에 지혜를 채워나가고 싶다는 생각으로 `Wisdom`이라는 이름을 붙였다. 블로그보다 덜 정제된 LOW 한 정보를 기록하는 것이 Wisdom의 목적)

## 요구사항

우선, 지금 당장 떠오르는 요구사항은 다음과 같다.

1. 지속하고 싶은 습관을 등록할 수 있다
2. 해당 습관은 TO DO LIST에 등록되어 습관을 기록할 수 있다
   1. 습관에 대해 행동한 날에 대해서 체크를 할 수 있음
   2. 체크한 날짜에 대해서 구체적인 내용을 작성할 수 있음
3. 체크된 현황을 확인할 수 있는 대시보드가 있다
4. 알림을 받을 수 있다
   1. 하루의 마지막에 알림을 받을 수 있다 (습관 체크)
5. 로그인을 할 수 있다

## 기능

요구사항을 바탕으로 간단하게 어떤 기능이 필요할지 생각해봤다. (가장 우선시 되는 기능은 1~4)

1. 습관을 「등록, 수정, 삭제, 읽기」할 수 있다
2. 등록된 습관에 대한 Action의 상태를 바꿀 수 있다(complete, incomplete)
3. 매일매일의 습관에 대한 기록을 「등록, 수정, 삭제, 읽기」할 수 있다
4. 습관에 대한 달성 현황을 확인할 수 있다
5. 알림 허용을 하면, 푸쉬 알림을 받을 수 있다
6. 소셜 로그인을 할 수 있다
7. 자신의 대시보드를 URL 공개 기능 (노션의 URL 공개와 같은 개념)
8. 소셜 미디어 공유 기능
9. 여러 애니메이션 효과 넣기

## 기대 효과

### 서비스적인 측면

1. 자신이 설정한 습관을 잘 수행하고 있는지에 대해서 확인이 가능. 이를 통해 동기부여 목적
2. 알림 푸시 기능을 통해서, 습관을 지속적으로 유지할 수 있도록 함.
3. 자신의 꾸준한 성장 과정을 타인에게 공유할 수 있음.

### 개발적인 측면

개발적인 측면에서는 그간 해보지 못했던 경험을 하는 게 주 목적이다.

1. React Unit 테스트 코드 작성
2. 도커로 환경 구축
3. Github Action로 CICD 파이프라인 구축 후 배포 자동화
4. AWS 아키텍쳐 구성
5. styled-component

## 기술 선정

1. React
   1. react hook form
   2. react-dom-router
2. Typescript
3. AWS
4. docker
5. Github Action (CICD)
6. Jest

## 아키텍쳐

![](https://i.imgur.com/UnWefQI.png)

## 간단한 디자인

![](https://i.imgur.com/rneHBBU.png)

## WBS

제작 기간은 약 2-3개월 정도로 생각 중. 기획에 있어서도 부족한 부분이 많기 때문에, 애자일 방식으로 부족한 부분이 있으면 그때그때 업데이트하는 방향으로 가져가야겠다.