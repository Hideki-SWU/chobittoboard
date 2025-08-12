ちょびっとボード (chobittoBoard)
micro:bitでDCモーターを簡単に動かすためのMakeCode拡張機能です！🚗✨

🚀 機能
基本操作
✅ DCモーターのオン/オフ制御
✅ モーター速度制御（0-1023）
✅ すべてのモーター停止
✅ 初期化機能
詳細操作
✅ 左右モーター個別制御（ロボットカー用）
✅ 両方のモーター同時制御
✅ 指定時間での動作制御
✅ PWM周波数設定
✅ モーター状態取得
✅ 動作状況確認
📦 インストール方法
MakeCode Editorで使用する場合
MakeCode for micro:bit を開く
新しいプロジェクトを作成
拡張機能 をクリック
検索ボックスに以下のGitHubリポジトリURLを入力:
https://github.com/username/chobittoboard
ちょびっとボード 拡張機能を選択してインストール
ローカル開発の場合
リポジトリをクローン:
bash
git clone https://github.com/username/chobittoboard.git
cd chobittoboard
MakeCode CLIでビルド:
bash
pxt build
🔌 ハードウェア接続
DCモーター接続（ロボットカー用）
micro:bit → モータードライバー (L293D/L298N)
-----------------------------------------
Pin 0 (P0) → Input 1 (左モーター制御)
Pin 1 (P1) → Input 2 (右モーター制御)
3V → VCC
GND → GND

モーター接続:
左モーター → Output 1
右モーター → Output 2

外部電源 → Motor Power Supply
単体モーター接続
micro:bit → モータードライバー
--------------------------
Pin 0 (P0) → Input 1
Pin 1 (P1) → Input 2
3V → VCC
GND → GND

モーター → Output 1&2
外部電源 → Motor Power
注意: DCモーターには必ず外部電源を使用してください。micro:bitの3Vでは十分な電流を供給できません。
📝 使用例
基本的なモーター制御
typescript
// ちょびっとボードをはじめる
chobittoBoard.initMotorControl()

// モーターAをオンにする
chobittoBoard.setMotor(MotorPin.A, MotorState.On)

// 2秒待機
basic.pause(2000)

// モーターAを停止
chobittoBoard.setMotor(MotorPin.A, MotorState.Off)
速度制御
typescript
// モーターAを半分の速度で動作
chobittoBoard.setMotorSpeed(MotorPin.A, 512)

// モーターBを最大速度で動作
chobittoBoard.setMotorSpeed(MotorPin.B, 1023)

// 3秒後にすべて停止
basic.pause(3000)
chobittoBoard.stopAllMotors()
ロボットカー制御
typescript
// 前進
chobittoBoard.setBothMotors(MotorDirection.Forward, 600)

// 右カーブ（左モーター速く、右モーター遅く）
chobittoBoard.setLeftRightMotors(800, 400)

// 左カーブ（右モーター速く、左モーター遅く）
chobittoBoard.setLeftRightMotors(400, 800)

// 停止
chobittoBoard.stopAllMotors()
センサーとの組み合わせ例
typescript
// 温度に応じてファンの速度を制御
basic.forever(function () {
    let temp = input.temperature()
    if (temp > 25) {
        let speed = (temp - 25) * 40  // 温度に比例した速度
        chobittoBoard.setMotorSpeed(MotorPin.A, Math.min(speed, 1023))
    } else {
        chobittoBoard.setMotor(MotorPin.A, MotorState.Off)
    }
    basic.pause(1000)
})
ロボットカーの例
typescript
// 前進
function moveForward() {
    chobittoBoard.setLeftRightMotors(800, 800)  // 左右同じ速度
}

// 右カーブ
function turnRight() {
    chobittoBoard.setLeftRightMotors(800, 400)  // 左速く、右遅く
}

// 左カーブ
function turnLeft() {
    chobittoBoard.setLeftRightMotors(400, 800)  // 右速く、左遅く
}

// 後退
function moveBackward() {
    chobittoBoard.setBothMotors(MotorDirection.Reverse, 600)
}

// ボタンで操作
input.onButtonPressed(Button.A, function () {
    moveForward()
})

input.onButtonPressed(Button.B, function () {
    turnRight()
})

// A+Bボタンで停止
input.onButtonPressed(Button.AB, function () {
    chobittoBoard.stopAllMotors()
})

// 傾きセンサーで操作
basic.forever(function () {
    if (input.isGesture(Gesture.LogoUp)) {
        moveForward()
    } else if (input.isGesture(Gesture.TiltLeft)) {
        turnLeft()
    } else if (input.isGesture(Gesture.TiltRight)) {
        turnRight()
    } else if (input.isGesture(Gesture.LogoDown)) {
        moveBackward()
    } else if (input.isGesture(Gesture.Shake)) {
        chobittoBoard.stopAllMotors()
    }
})
🎯 対応ピン
ピン名	ピン番号	用途
モーターA	P0	左モーター（ロボットカー）またはメインモーター
モーターB	P1	右モーター（ロボットカー）またはセカンドモーター
⚙️ API リファレンス
基本操作
関数	説明	パラメータ
initMotorControl()	ちょびっとボードを初期化	なし
setMotor(motor, state)	モーターのオン/オフ	motor: MotorPin, state: MotorState
setMotorSpeed(motor, speed)	モーター速度設定	motor: MotorPin, speed: 0-1023
stopAllMotors()	すべてのモーターを停止	なし
詳細操作
関数	説明	パラメータ
setBothMotors(direction, speed)	両方のモーター制御	direction: MotorDirection, speed: 0-1023
setLeftRightMotors(leftSpeed, rightSpeed)	左右モーター個別制御	leftSpeed/rightSpeed: 0-1023
runMotorForDuration(motor, speed, duration)	指定時間動作	motor: MotorPin, speed: 0-1023, duration: ms
runBothMotorsForDuration(leftSpeed, rightSpeed, duration)	両方のモーター指定時間動作	leftSpeed/rightSpeed: 0-1023, duration: ms
setPWMFrequency(motor, frequency)	PWM周波数設定	motor: MotorPin, frequency: 1-40000 Hz
getMotorSpeed(motor)	現在の速度取得	motor: MotorPin
isMotorRunning(motor)	動作状況確認	motor: MotorPin
🔧 トラブルシューティング
モーターが動かない場合
電源確認: 外部電源が正しく接続されているか確認
配線確認: ピンの接続が正しいか確認
コード確認: 初期化が実行されているか確認
電圧確認: モータードライバーに適切な電圧が供給されているか確認
期待通りの動作をしない場合
速度値: 0-1023の範囲内の値を使用しているか確認
PWM周波数: モーターに適した周波数を設定しているか確認
干渉: 他のピンとの信号干渉がないか確認
パフォーマンスの問題
電源容量: 複数モーター使用時は十分な電源容量を確保
熱対策: 長時間使用時はモータードライバーの放熱を考慮
プログラム最適化: 不要なpause()を減らして応答性を向上
📋 必要な部品
基本セット
micro:bit v2
モータードライバー (L293D, L298N, DRV8833など)
DCモーター x2 (3-6V推奨、ロボットカー用)
ジャンパーワイヤー
ブレッドボード
外部電源 (電池パック等、4.5V-6V推奨)
ロボットカーセット
上記基本セット
ロボットカーシャーシ
タイヤ x2
キャスターボール（前輪用）
ネジ・ナット類
単体モーター用
micro:bit v2
モータードライバー
DCモーター x1
外部電源
制御対象（ファン、ポンプなど）
📜 ライセンス
MIT License
🤝 コントリビューション
このリポジトリをフォーク
機能ブランチを作成 (git checkout -b feature/amazing-feature)
変更をコミット (git commit -m 'Add amazing feature')
ブランチをプッシュ (git push origin feature/amazing-feature)
プルリクエストを作成
📞 サポート
Issues: GitHub Issues
Discussions: GitHub Discussions
Email: support@chobittoboard.com
🔗 関連リンク
micro:bit公式サイト
MakeCode for micro:bit
拡張機能開発ガイド
