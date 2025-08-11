/**
 * ちょびっとボード DCモーターテストプログラム
 */
/**
 * Motor Control Extension Test
 * 拡張機能のテスト用プログラム
 */

// テスト開始の表示
basic.showString("TEST")
basic.pause(1000)

// モーター制御を初期化
motorControl.initMotorControl()

basic.forever(function () {
    // Aボタン: 基本的なモーター制御テスト
    input.onButtonPressed(Button.A, function () {
        basic.showString("A")
        
        // モーターAを段階的に速度アップ
        for (let speed = 0; speed <= 1023; speed += 200) {
            motorControl.setMotorSpeed(MotorPin.A, speed)
            basic.pause(500)
        }
        
        // モーターを停止
        motorControl.setMotor(MotorPin.A, MotorState.Off)
        basic.showIcon(IconNames.Yes)
        basic.pause(1000)
        basic.clearScreen()
    })

    // Bボタン: 複数モーター制御テスト
    input.onButtonPressed(Button.B, function () {
        basic.showString("B")
        
        // すべてのモーターを順番にテスト
        let motors = [MotorPin.A, MotorPin.B, MotorPin.C, MotorPin.D]
        
        for (let motor of motors) {
            motorControl.setMotorSpeed(motor, 800)
            basic.pause(1000)
            motorControl.setMotor(motor, MotorState.Off)
            basic.pause(500)
        }
        
        basic.showIcon(IconNames.Yes)
        basic.pause(1000)
        basic.clearScreen()
    })

    // A+Bボタン: 双方向モーター制御テスト
    input.onButtonPressed(Button.AB, function () {
        basic.showString("AB")
        
        // 正転テスト
        motorControl.setBidirectionalMotor(
            MotorPin.A, 
            MotorPin.B, 
            MotorDirection.Forward, 
            600
        )
        basic.pause(2000)
        
        // 停止
        motorControl.setBidirectionalMotor(
            MotorPin.A, 
            MotorPin.B, 
            MotorDirection.Stop, 
            0
        )
        basic.pause(1000)
        
        // 逆転テスト
        motorControl.setBidirectionalMotor(
            MotorPin.A, 
            MotorPin.B, 
            MotorDirection.Reverse, 
            600
        )
        basic.pause(2000)
        
        // 停止
        motorControl.setBidirectionalMotor(
            MotorPin.A, 
            MotorPin.B, 
            MotorDirection.Stop, 
            0
        )
        
        basic.showIcon(IconNames.Yes)
        basic.pause(1000)
        basic.clearScreen()
    })

    // 傾きセンサーでモーター制御テスト
    if (input.isGesture(Gesture.TiltLeft)) {
        motorControl.setMotorSpeed(MotorPin.A, 400)
        motorControl.setMotorSpeed(MotorPin.B, 800)
        basic.showArrow(ArrowNames.West)
    } else if (input.isGesture(Gesture.TiltRight)) {
        motorControl.setMotorSpeed(MotorPin.A, 800)
        motorControl.setMotorSpeed(MotorPin.B, 400)
        basic.showArrow(ArrowNames.East)
    } else if (input.isGesture(Gesture.LogoUp)) {
        motorControl.setMotorSpeed(MotorPin.A, 800)
        motorControl.setMotorSpeed(MotorPin.B, 800)
        basic.showArrow(ArrowNames.North)
    } else if (input.isGesture(Gesture.LogoDown)) {
        motorControl.setBidirectionalMotor(
            MotorPin.A, 
            MotorPin.B, 
            MotorDirection.Reverse, 
            800
        )
        basic.showArrow(ArrowNames.South)
    } else if (input.isGesture(Gesture.Shake)) {
        motorControl.stopAllMotors()
        basic.showIcon(IconNames.Square)
    }

    basic.pause(100)
})

// サーボモーターテスト（ピンP2使用）
let servoAngle = 90

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    basic.showString("SERVO")
    
    // サーボを0度から180度まで動かす
    for (let angle = 0; angle <= 180; angle += 30) {
        motorControl.setServoAngle(MotorPin.C, angle)
        basic.pause(500)
    }
    
    // 元の位置に戻す
    motorControl.setServoAngle(MotorPin.C, 90)
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    basic.clearScreen()
})

// 温度センサーでファン制御テスト
basic.forever(function () {
    let temperature = input.temperature()
    
    if (temperature > 22) {
        // 温度が22度以上の場合、ファンを動作
        let fanSpeed = (temperature - 22) * 100
        fanSpeed = Math.min(fanSpeed, 1023)  // 最大速度制限
        
        motorControl.setMotorSpeed(MotorPin.D, fanSpeed)
        
        // 温度を表示
        if (temperature % 5 == 0) {  // 5秒おきに表示
            basic.showNumber(temperature)
            basic.pause(1000)
            basic.clearScreen()
        }
    } else {
        // 温度が低い場合、ファンを停止
        motorControl.setMotor(MotorPin.D, MotorState.Off)
    }
    
    basic.pause(1000)
})

// 光センサーで速度制御テスト
basic.forever(function () {
    let lightLevel = input.lightLevel()
    
    // 光の強さに応じてモーター速度を調整（Pin1のモーター）
    let speed = Math.map(lightLevel, 0, 255, 0, 1023)
    
    if (lightLevel > 50) {  // 明るい場合のみ動作
        motorControl.setMotorSpeed(MotorPin.B, speed)
        
        // 光レベルを5段階で表示
        if (lightLevel % 10 == 0) {
            let level = Math.floor(lightLevel / 51)  // 0-4の範囲
            basic.showNumber(level)
            basic.pause(500)
            basic.clearScreen()
        }
    } else {
        motorControl.setMotor(MotorPin.B, MotorState.Off)
    }
    
    basic.pause(200)
})

// PWM周波数テスト
input.onPinPressed(TouchPin.P0, function () {
    basic.showString("PWM")
    
    // 異なる周波数でモーターをテスト
    let frequencies = [100, 500, 1000, 2000, 5000]
    
    for (let freq of frequencies) {
        motorControl.setPWMFrequency(MotorPin.A, freq)
        motorControl.setMotorSpeed(MotorPin.A, 512)
        basic.showNumber(freq)
        basic.pause(2000)
        motorControl.setMotor(MotorPin.A, MotorState.Off)
        basic.pause(500)
    }
    
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    basic.clearScreen()
})

// 連続回転サーボテスト
input.onPinPressed(TouchPin.P1, function () {
    basic.showString("CONT")
    
    // 連続回転サーボの速度テスト
    let speeds = [-100, -50, 0, 50, 100]
    
    for (let speed of speeds) {
        motorControl.setContinuousServo(MotorPin.C, speed)
        basic.showNumber(speed)
        basic.pause(2000)
    }
    
    // 停止
    motorControl.setContinuousServo(MotorPin.C, 0)
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    basic.clearScreen()
})

// 指定時間動作テスト
input.onPinPressed(TouchPin.P2, function () {
    basic.showString("TIME")
    
    // 3秒間モーターを動作させる
    motorControl.runMotorForDuration(MotorPin.A, 800, 3000)
    
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    basic.clearScreen()
})

// エラーハンドリングテスト
function testErrorHandling() {
    basic.showString("ERR")
    
    // 範囲外の値でテスト（自動的に制限される）
    motorControl.setMotorSpeed(MotorPin.A, 2000)  // 1023に制限される
    basic.pause(1000)
    
    motorControl.setMotorSpeed(MotorPin.A, -100)  // 0に制限される
    basic.pause(1000)
    
    motorControl.setServoAngle(MotorPin.B, 200)   // 180に制限される
    basic.pause(1000)
    
    motorControl.setServoAngle(MotorPin.B, -50)   // 0に制限される
    basic.pause(1000)
    
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    basic.clearScreen()
}

// 起動時にエラーハンドリングテストを実行
basic.pause(3000)  // 他のテストが落ち着いてから実行
testErrorHandling()

// テスト完了メッセージ
basic.showString("READY")
basic.clearScreen()
