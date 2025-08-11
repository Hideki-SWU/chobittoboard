# ちょびっとボード (chobittoBoard)

micro:bitでDCモーターを簡単に動かすためのMakeCode拡張機能です！🚗✨  
# micro:bit Motor Control Extension

micro:bitでモーター制御を簡単に行うためのMakeCode拡張機能です。DCモーター、サーボモーター、PWM制御に対応しています。

## 🚀 機能

### 基本制御
- ✅ モーターのオン/オフ制御
- ✅ モーター速度制御（0-1023）
- ✅ すべてのモーター停止
- ✅ 初期化機能

### 詳細制御
- ✅ 双方向モーター制御
- ✅ 指定時間での動作制御
- ✅ PWM周波数設定
- ✅ モーター状態取得
- ✅ 動作状況確認

### サーボ制御
- ✅ サーボモーター角度制御（0-180度）
- ✅ 連続回転サーボ制御

## 📦 インストール方法

### MakeCode Editorで使用する場合

1. [MakeCode for micro:bit](https://makecode.microbit.org) を開く
2. 新しいプロジェクトを作成
3. **拡張機能** をクリック
4. 検索ボックスに以下のGitHubリポジトリURLを入力:
   ```
   https://github.com/username/microbit-motor-control
   ```
5. **モーター制御** 拡張機能を選択してインストール

### ローカル開発の場合

1. リポジトリをクローン:
   ```bash
   git clone https://github.com/username/microbit-motor-control.git
   cd microbit-motor-control
   ```

2. MakeCode CLIでビルド:
   ```bash
   pxt build
   ```

## 🔌 ハードウェア接続

### 基本的なDCモーター接続

```
micro:bit → モータードライバー (L293D/L298N)
-----------------------------------------
Pin 0 (P0) → Input 1
Pin 1 (P1) → Input 2  
Pin 2 (P2) → Input 3
Pin 8 (P8) → Input 4
3V → VCC
GND → GND

モーター接続:
Motor A → Output 1&2
Motor B → Output 3&4

外部電源 → Motor Power Supply
```

### サーボモーター接続

```
micro:bit → サーボモーター
-----------------------
Pin 0-2 → Signal (オレンジ線)
3V → Power (赤線)
GND → Ground (茶色線)
```

**注意**: 大型サーボや複数サーボの場合は外部電源を使用してください。

## 📝 使用例

### 基本的なモーター制御

```typescript
// モーター制御を初期化
motorControl.initMotorControl()

// モーターAをオンにする
motorControl.setMotor(MotorPin.A, MotorState.On)

// 2秒待機
basic.pause(2000)

// モーターAを停止
motorControl.setMotor(MotorPin.A, MotorState.Off)
```

### 速度制御

```typescript
// モーターAを半分の速度で動作
motorControl.setMotorSpeed(MotorPin.A, 512)

// モーターBを最大速度で動作
motorControl.setMotorSpeed(MotorPin.B, 1023)

// 3秒後にすべて停止
basic.pause(3000)
motorControl.stopAllMotors()
```

### 双方向モーター制御

```typescript
// 正転で速度512
motorControl.setBidirectionalMotor(
    MotorPin.A, 
    MotorPin.B, 
    MotorDirection.Forward, 
    512
)

basic.pause(2000)

// 逆転で速度300
motorControl.setBidirectionalMotor(
    MotorPin.A, 
    MotorPin.B, 
    MotorDirection.Reverse, 
    300
)
```

### サーボモーター制御

```typescript
// サーボを90度に設定
motorControl.setServoAngle(MotorPin.A, 90)

// 連続回転サーボを時計回りに回転
motorControl.setContinuousServo(MotorPin.B, 50)
```

### センサーとの組み合わせ例

```typescript
// 温度に応じてファンの速度を制御
basic.forever(function () {
    let temp = input.temperature()
    if (temp > 25) {
        let speed = (temp - 25) * 40  // 温度に比例した速度
        motorControl.setMotorSpeed(MotorPin.A, Math.min(speed, 1023))
    } else {
        motorControl.setMotor(MotorPin.A, MotorState.Off)
    }
    basic.pause(1000)
})
```

### ロボットカーの例

```typescript
// 前進
function moveForward() {
    motorControl.setMotorSpeed(MotorPin.A, 800)  // 左モーター
    motorControl.setMotorSpeed(MotorPin.B, 800)  // 右モーター
}

// 右回転
function turnRight() {
    motorControl.setMotorSpeed(MotorPin.A, 600)  // 左モーター（速く）
    motorControl.setMotorSpeed(MotorPin.B, 200)  // 右モーター（遅く）
}

// ボタンAで前進、ボタンBで右回転
input.onButtonPressed(Button.A, function () {
    moveForward()
})

input.onButtonPressed(Button.B, function () {
    turnRight()
})

// A+Bボタンで停止
input.onButtonPressed(Button.AB, function () {
    motorControl.stopAllMotors()
})
```

## 🎯 対応ピン

| ピン名 | ピン番号 | 用途 |
|--------|----------|------|
| モーターA | P0 | メインモーター |
| モーターB | P1 | セカンドモーター |
| モーターC | P2 | サードモーター |
| モーターD | P8 | フォースモーター |

## ⚙️ API リファレンス

### 基本制御

| 関数 | 説明 | パラメータ |
|------|------|------------|
| `initMotorControl()` | モーター制御を初期化 | なし |
| `setMotor(motor, state)` | モーターのオン/オフ | motor: MotorPin, state: MotorState |
| `setMotorSpeed(motor, speed)` | モーター速度設定 | motor: MotorPin, speed: 0-1023 |
| `stopAllMotors()` | すべてのモーターを停止 | なし |

### 詳細制御

| 関数 | 説明 | パラメータ |
|------|------|------------|
| `setBidirectionalMotor(motorA, motorB, direction, speed)` | 双方向モーター制御 | motorA/B: MotorPin, direction: MotorDirection, speed: 0-1023 |
| `runMotorForDuration(motor, speed, duration)` | 指定時間動作 | motor: MotorPin, speed: 0-1023, duration: ms |
| `setPWMFrequency(motor, frequency)` | PWM周波数設定 | motor: MotorPin, frequency: 1-40000 Hz |
| `getMotorSpeed(motor)` | 現在の速度取得 | motor: MotorPin |
| `isMotorRunning(motor)` | 動作状況確認 | motor: MotorPin |

### サーボ制御

| 関数 | 説明 | パラメータ |
|------|------|------------|
| `setServoAngle(servo, angle)` | サーボ角度設定 | servo: MotorPin, angle: 0-180度 |
| `setContinuousServo(servo, speed)` | 連続回転サーボ | servo: MotorPin, speed: -100〜100 |

## 🔧 トラブルシューティング

### モーターが動かない場合

1. **電源確認**: 外部電源が正しく接続されているか確認
2. **配線確認**: ピンの接続が正しいか確認
3. **コード確認**: 初期化が実行されているか確認
4. **電圧確認**: モータードライバーに適切な電圧が供給されているか確認

### 期待通りの動作をしない場合

1. **速度値**: 0-1023の範囲内の値を使用しているか確認
2. **PWM周波数**: モーターに適した周波数を設定しているか確認
3. **干渉**: 他のピンとの信号干渉がないか確認

### パフォーマンスの問題

1. **電源容量**: 複数モーター使用時は十分な電源容量を確保
2. **熱対策**: 長時間使用時はモータードライバーの放熱を考慮
3. **プログラム最適化**: 不要なpause()を減らして応答性を向上

## 📋 必要な部品

### 基本セット
- micro:bit v2
- モータードライバー (L293D, L298N, DRV8833など)
- DCモーター (3-6V推奨)
- ジャンパーワイヤー
- ブレッドボード
- 外部電源 (電池パック等)

### 拡張セット
- サーボモーター (SG90等)
- エンコーダー付きモーター
- ステッピングモーター
- 大容量電源アダプター

## 📜 ライセンス

MIT License

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

- Issues: [GitHub Issues](https://github.com/username/microbit-motor-control/issues)
- Discussions: [GitHub Discussions](https://github.com/username/microbit-motor-control/discussions)
- Email: support@example.com

## 🔗 関連リンク

- [micro:bit公式サイト](https://microbit.org/)
- [MakeCode for micro:bit](https://makecode.microbit.org/)
- [拡張機能開発ガイド](https://makecode.com/extensions)
- 
