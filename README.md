# chobittoboard

ChobittoBoard 用 MakeCode 拡張。  
- モーター1: **P0**（PWM 0–100%）
- モーター2: **P1**（PWM 0–100%）

## 使えるブロック
- モーター1 ON / OFF / 速度% / 指定ms回す
- モーター2 ON / OFF / 速度% / 指定ms回す

## 配線
必ず **モータードライバ**（L293D / TB6612FNG など）を介してください。  
PWMはドライバの **IN もしくは EN** へ（回路に合わせて選択）。  
