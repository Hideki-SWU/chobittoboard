/**
 * ちょびっとボード - micro:bit DCモーター制御拡張機能
 * micro:bitでDCモーターを簡単に動かそう！
 */

//% weight=100 color=#FF6600 icon="\uf013" block="ちょびっとボード"
//% groups=['基本操作', '詳細操作']
namespace chobittoBoard {
    
/**
 * micro:bit Motor Control Extension
 * モーター制御用のMakeCode拡張機能
 */

//% weight=100 color=#FF6600 icon="\uf013" block="モーター制御"
//% groups=['基本制御', '詳細制御', 'サーボ制御']
namespace motorControl {
    
    /**
     * モーターピンの定義
     */
    export enum MotorPin {
        //% block="モーターA (P0)"
        A = AnalogPin.P0,
        //% block="モーターB (P1)" 
        B = AnalogPin.P1,
        //% block="モーターC (P2)"
        C = AnalogPin.P2,
        //% block="モーターD (P8)"
        D = AnalogPin.P8
    }

    /**
     * モーター回転方向の定義
     */
    export enum MotorDirection {
        //% block="正転"
        Forward = 1,
        //% block="逆転"
        Reverse = -1,
        //% block="停止"
        Stop = 0
    }

    /**
     * モーター状態の定義
     */
    export enum MotorState {
        //% block="オン"
        On = 1,
        //% block="オフ"
        Off = 0
    }

    // モーター状態を記録する変数
    let motorStates: { [key: number]: number } = {}
    let motorSpeeds: { [key: number]: number } = {}

    /**
     * モーターのオン/オフを制御
     * @param motor モーターピン
     * @param state モーター状態（オン/オフ）
     */
    //% block="モーター %motor を %state"
    //% blockId="motor_on_off"
    //% group="基本制御"
    //% weight=100
    export function setMotor(motor: MotorPin, state: MotorState): void {
        if (state === MotorState.On) {
            pins.analogWritePin(motor, 1023)
            motorStates[motor] = 1023
            basic.showLeds(`
                . . # . .
                . # # # .
                # # # # #
                . # # # .
                . . # . .
                `)
        } else {
            pins.analogWritePin(motor, 0)
            motorStates[motor] = 0
            basic.showLeds(`
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                `)
        }
        basic.pause(500)
        basic.clearScreen()
    }

    /**
     * モーターの速度を設定（0-1023）
     * @param motor モーターピン
     * @param speed 速度（0-1023）
     */
    //% block="モーター %motor の速度を %speed に設定"
    //% blockId="motor_speed"
    //% group="基本制御"
    //% weight=90
    //% speed.min=0 speed.max=1023 speed.defl=512
    export function setMotorSpeed(motor: MotorPin, speed: number): void {
        // 速度の範囲制限
        speed = Math.max(0, Math.min(1023, speed))
        pins.analogWritePin(motor, speed)
        motorStates[motor] = speed
        motorSpeeds[motor] = speed
        
        // 速度レベルを5段階でLEDに表示
        let level = Math.floor(speed / 205)
        showSpeedLevel(level)
        basic.pause(300)
        basic.clearScreen()
    }

    /**
     * モーターの回転方向を制御（双方向モーター用）
     * @param motorA モーターAピン
     * @param motorB モーターBピン  
     * @param direction 回転方向
     * @param speed 速度（0-1023）
     */
    //% block="双方向モーター A:%motorA B:%motorB を %direction 速度 %speed"
    //% blockId="motor_bidirectional"
    //% group="詳細制御"
    //% weight=80
    //% speed.min=0 speed.max=1023 speed.defl=512
    export function setBidirectionalMotor(motorA: MotorPin, motorB: MotorPin, direction: MotorDirection, speed: number): void {
        speed = Math.max(0, Math.min(1023, speed))
        
        if (direction === MotorDirection.Forward) {
            pins.analogWritePin(motorA, speed)
            pins.analogWritePin(motorB, 0)
            basic.showArrow(ArrowNames.North)
        } else if (direction === MotorDirection.Reverse) {
            pins.analogWritePin(motorA, 0)
            pins.analogWritePin(motorB, speed)
            basic.showArrow(ArrowNames.South)
        } else {
            pins.analogWritePin(motorA, 0)
            pins.analogWritePin(motorB, 0)
            basic.showIcon(IconNames.Square)
        }
        basic.pause(300)
        basic.clearScreen()
    }

    /**
     * すべてのモーターを停止
     */
    //% block="すべてのモーターを停止"
    //% blockId="motor_stop_all"
    //% group="基本制御"
    //% weight=70
    export function stopAllMotors(): void {
        pins.analogWritePin(AnalogPin.P0, 0)
        pins.analogWritePin(AnalogPin.P1, 0)
        pins.analogWritePin(AnalogPin.P2, 0)
        pins.analogWritePin(AnalogPin.P8, 0)
        
        // 状態をリセット
        motorStates = {}
        motorSpeeds = {}
        
        basic.showIcon(IconNames.Square)
        basic.pause(500)
        basic.clearScreen()
    }

    /**
     * モーターの現在の速度を取得
     * @param motor モーターピン
     */
    //% block="モーター %motor の速度"
    //% blockId="motor_get_speed"
    //% group="詳細制御"
    //% weight=60
    export function getMotorSpeed(motor: MotorPin): number {
        return motorSpeeds[motor] || 0
    }

    /**
     * モーターが動作中かどうかを確認
     * @param motor モーターピン
     */
    //% block="モーター %motor は動作中"
    //% blockId="motor_is_running"
    //% group="詳細制御"
    //% weight=50
    export function isMotorRunning(motor: MotorPin): boolean {
        return (motorStates[motor] || 0) > 0
    }

    /**
     * モーターを指定時間動作させる
     * @param motor モーターピン
     * @param speed 速度（0-1023）
     * @param duration 動作時間（ミリ秒）
     */
    //% block="モーター %motor を速度 %speed で %duration ms動作"
    //% blockId="motor_run_duration"
    //% group="詳細制御"
    //% weight=40
    //% speed.min=0 speed.max=1023 speed.defl=512
    //% duration.min=100 duration.max=10000 duration.defl=1000
    export function runMotorForDuration(motor: MotorPin, speed: number, duration: number): void {
        speed = Math.max(0, Math.min(1023, speed))
        pins.analogWritePin(motor, speed)
        motorStates[motor] = speed
        basic.pause(duration)
        pins.analogWritePin(motor, 0)
        motorStates[motor] = 0
    }

    /**
     * PWM周波数を設定
     * @param motor モーターピン
     * @param frequency 周波数（Hz）
     */
    //% block="モーター %motor のPWM周波数を %frequency Hz に設定"
    //% blockId="motor_set_pwm_frequency"
    //% group="詳細制御"
    //% weight=30
    //% frequency.min=1 frequency.max=40000 frequency.defl=1000
    export function setPWMFrequency(motor: MotorPin, frequency: number): void {
        pins.analogSetPwmPin(motor)
        pins.analogSetPeriod(motor, Math.floor(1000000 / frequency))
    }

    /**
     * サーボモーターの角度を設定
     * @param servo サーボピン
     * @param angle 角度（0-180度）
     */
    //% block="サーボ %servo を %angle 度に設定"
    //% blockId="servo_set_angle"
    //% group="サーボ制御"
    //% weight=20
    //% angle.min=0 angle.max=180 angle.defl=90
    export function setServoAngle(servo: MotorPin, angle: number): void {
        angle = Math.max(0, Math.min(180, angle))
        pins.servoWritePin(servo, angle)
        
        // 角度に応じたLED表示
        if (angle < 45) {
            basic.showArrow(ArrowNames.West)
        } else if (angle < 135) {
            basic.showArrow(ArrowNames.North)
        } else {
            basic.showArrow(ArrowNames.East)
        }
        basic.pause(300)
        basic.clearScreen()
    }

    /**
     * 連続回転サーボの制御
     * @param servo サーボピン
     * @param speed 速度（-100から100、0は停止）
     */
    //% block="連続回転サーボ %servo を速度 %speed で回転"
    //% blockId="continuous_servo"
    //% group="サーボ制御"
    //% weight=10
    //% speed.min=-100 speed.max=100 speed.defl=0
    export function setContinuousServo(servo: MotorPin, speed: number): void {
        speed = Math.max(-100, Math.min(100, speed))
        
        // 速度を角度に変換（90度が停止、0-180度の範囲）
        let angle = 90 + (speed * 90 / 100)
        pins.servoWritePin(servo, angle)
        
        if (speed > 0) {
            basic.showArrow(ArrowNames.East)
        } else if (speed < 0) {
            basic.showArrow(ArrowNames.West)
        } else {
            basic.showIcon(IconNames.SmallSquare)
        }
        basic.pause(300)
        basic.clearScreen()
    }

    /**
     * 速度レベルをLEDで表示する内部関数
     */
    function showSpeedLevel(level: number): void {
        if (level <= 0) {
            basic.showLeds(`
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                `)
        } else if (level == 1) {
            basic.showLeds(`
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                # # # # #
                `)
        } else if (level == 2) {
            basic.showLeds(`
                . . . . .
                . . . . .
                . . . . .
                # # # # #
                # # # # #
                `)
        } else if (level == 3) {
            basic.showLeds(`
                . . . . .
                . . . . .
                # # # # #
                # # # # #
                # # # # #
                `)
        } else if (level == 4) {
            basic.showLeds(`
                . . . . .
                # # # # #
                # # # # #
                # # # # #
                # # # # #
                `)
        } else {
            basic.showLeds(`
                # # # # #
                # # # # #
                # # # # #
                # # # # #
                # # # # #
                `)
        }
    }

    /**
     * 初期化処理
     */
    //% block="モーター制御を初期化"
    //% blockId="motor_init"
    //% group="基本制御"
    //% weight=110
    export function initMotorControl(): void {
        stopAllMotors()
        basic.showIcon(IconNames.Happy)
        basic.pause(1000)
        basic.clearScreen()
    }
}
}
