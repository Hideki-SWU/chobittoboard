/**
 * ちょびっとボード DCモーターテストプログラム
 * 拡張機能のテスト用プログラム
 */

// テスト開始の表示
basic.showString("TEST")
basic.pause(1000)

// ちょびっとボードをはじめる
chobittoBoard.initMotorControl()

basic.forever(function () {
    // Aボタン: 基本的なモーター制御テスト
    input.onButtonPressed(Button.A, function () {
        basic.showString("A")
        
        // モーターAを段階的に速度アップ
        for (let speed = 0; speed <= 1023; speed += 200) {
            chobittoBoard.setMotorSpeed(MotorPin.A, speed)
            basic.pause(500)
        }
        
        // モーターを停止
        chobittoBoard.setMotor(MotorPin.A, MotorState.Off)
        basic.showIcon(IconNames.Yes)
        basic.pause(1000)
        basic.clearScreen()
    })

    // Bボタン: 両方のモーター制御テスト
    input.onButtonPressed(Button.B, function () {
        basic.showString("B")
        
        // 両方のモーターを順番にテスト
        let motors = [MotorPin.A, MotorPin.B]
        
        for (let motor of motors) {
            chobittoBoard.setMotorSpeed(motor, 800)
            basic.pause(1000)
            chobittoBoard.setMotor(motor, MotorState.Off)
            basic.pause(500)
        }
        
        basic.showIcon(IconNames.Yes)
        basic.pause(1000)
        basic.clearScreen()
    })

    // A+Bボタン: ロボットカー動作テスト
    input.onButtonPressed(Button.AB, function () {
        basic.showString("AB")
        
        // 前進テスト
        chobittoBoard.setBothMotors(MotorDirection.Forward, 600)
        basic.pause(2000)
        
        // 停止
        chobittoBoard.setBothMotors(MotorDirection.Stop, 0)
        basic.pause(1000)
        
        // 左右個別制御テスト（右カーブ）
        chobittoBoard.setLeftRightMotors(800, 400)
        basic.pause(2000)
        
        // 停止
        chobittoBoard.stopAllMotors()
        
        basic.showIcon(IconNames.Yes)
        basic.pause(1000)
        basic.clearScreen()
    })

    // 傾きセンサーでロボットカー制御テスト
    if (input.isGesture(Gesture.TiltLeft)) {
        // 左カーブ
        chobittoBoard.setLeftRightMotors(400, 800)
        basic.showArrow(ArrowNames.West)
    } else if (input.isGesture(Gesture.TiltRight)) {
        // 右カーブ
        chobittoBoard.setLeftRightMotors(800, 400)
        basic.showArrow(ArrowNames.East)
    } else if (input.isGesture(Gesture.LogoUp)) {
        // 前進
        chobittoBoard.setBothMotors(MotorDirection.Forward, 800)
        basic.showArrow(ArrowNames.North)
    } else if (input.isGesture(Gesture.LogoDown)) {
        // 後退
        chobittoBoard.setBothMotors(MotorDirection.Reverse, 800)
        basic.showArrow(ArrowNames.South)
    } else if (input.isGesture(Gesture.Shake)) {
        // 停止
        chobittoBoard.stopAllMotors()
        basic.showIcon(IconNames.Square)
    }

    basic.pause(100)
})

// 温度センサーでファン制御テスト
basic.forever(function () {
    let temperature = input.temperature()
    
    if (temperature > 22) {
        // 温度が22度以上の場合、ファンを動作
        let fanSpeed = (temperature - 22) * 100
        fanSpeed = Math.min(fanSpeed, 1023)  // 最大速度制限
        
        chobittoBoard.setMotorSpeed(MotorPin.A, fanSpeed)
        
        // 温度を表示
        if (temperature % 5 == 0) {  // 5秒おきに表示
            basic.showNumber(temperature)
            basic.pause(1000)
            basic.clearScreen()
        }
    } else {
        // 温度が低い場合、ファンを停止
        chobittoBoard.setMotor(MotorPin.A, MotorState.Off)
    }
    
    basic.pause(1000)
})

// 光センサーで速度制御テスト
basic.forever(function () {
    let lightLevel = input.lightLevel()
    
    // 光の強さに応じてモーター速度を調整（Pin1のモーター）
    let speed = Math.map(lightLevel, 0, 255, 0, 1023)
    
    if (lightLevel > 50) {  // 明るい場合のみ動作
        chobittoBoard.setMotorSpeed(MotorPin.B, speed)
        
        // 光レベルを5段階で表示
        if (lightLevel % 10 == 0) {
            let level = Math.floor(lightLevel / 51)  // 0-4の範囲
            basic.showNumber(level)
            basic.pause(500)
            basic.clearScreen()
        }
    } else {
        chobittoBoard.setMotor(MotorPin.B, MotorState.Off)
    }
    
    basic.pause(200)
})

// PWM周波数テスト
input.onPinPressed(TouchPin.P0, function () {
    basic.showString("PWM")
    
    // 異なる周波数でモーターをテスト
    let frequencies = [100, 500, 1000, 2000, 5000]
    
    for (let freq of frequencies) {
        chobittoBoard.setPWMFrequency(MotorPin.A, freq)
        chobittoBoard.setMotorSpeed(MotorPin.A, 512)
        basic.showNumber(freq)
        basic.pause(2000)
        chobittoBoard.setMotor(MotorPin.A, MotorState.Off)
        basic.pause(500)
    }
    
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    basic.clearScreen()
})

// 指定時間動作テスト
input.onPinPressed(TouchPin.P1, function () {
    basic.showString("TIME")
    
    // 3秒間モーターを動作させる
    chobittoBoard.runMotorForDuration(MotorPin.A, 800, 3000)
    
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    basic.clearScreen()
})

// 両方のモーター時間動作テスト
input.onPinPressed(TouchPin.P2, function () {
    basic.showString("BOTH")
    
    // 両方のモーターを2秒間動作
    chobittoBoard.runBothMotorsForDuration(700, 700, 2000)
    
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    basic.clearScreen()
})

// ロボットカーの基本動作テスト
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    basic.showString("CAR")
    
    // 前進
    chobittoBoard.setBothMotors(MotorDirection.Forward, 600)
    basic.pause(2000)
    
    // 右カーブ
    chobittoBoard.setLeftRightMotors(800, 400)
    basic.pause(1000)
    
    // 左カーブ
    chobittoBoard.setLeftRightMotors(400, 800)
    basic.pause(1000)
    
    // 後退
    chobittoBoard.setBothMotors(MotorDirection.Reverse, 600)
    basic.pause(1000)
    
    // 停止
    chobittoBoard.stopAllMotors()
    
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    basic.clearScreen()
})

// エラーハンドリングテスト
function testErrorHandling() {
    basic.showString("ERR")
    
    // 範囲外の値でテスト（自動的に制限される）
    chobittoBoard.setMotorSpeed(MotorPin.A, 2000)  // 1023に制限される
    basic.pause(1000)
    
    chobittoBoard.setMotorSpeed(MotorPin.A, -100)  // 0に制限される
    basic.pause(1000)
    
    chobittoBoard.setLeftRightMotors(1500, -200)   // 範囲内に制限される
    basic.pause(1000)
    
    chobittoBoard.stopAllMotors()
    
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    basic.clearScreen()
}

// モーター状態取得テスト
function testMotorStatus() {
    basic.showString("STATUS")
    
    // モーターAを動作
    chobittoBoard.setMotorSpeed(MotorPin.A, 500)
    
    // 状態確認
    if (chobittoBoard.isMotorRunning(MotorPin.A)) {
        basic.showIcon(IconNames.Yes)
        let speed = chobittoBoard.getMotorSpeed(MotorPin.A)
        basic.showNumber(speed)
    }
    
    basic.pause(2000)
    chobittoBoard.stopAllMotors()
    
    // 停止状態確認
    if (!chobittoBoard.isMotorRunning(MotorPin.A)) {
        basic.showIcon(IconNames.No)
    }
    
    basic.pause(1000)
    basic.clearScreen()
}

// 起動時にテストを順次実行
basic.pause(3000)  // 他の処理が落ち着いてから実行
testErrorHandling()
basic.pause(1000)
testMotorStatus()

// テスト完了メッセージ
basic.showString("READY")
basic.clearScreen()
