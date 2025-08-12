/**
 * ChobittoBoard: モーター1(P0)・モーター2(P1)をPWM制御（片方向）
 */
//% color="#ff6600" icon="\uf085" block="chobittoboard"
namespace chobittoboard {

    // 0–100% → 0–1023 に変換
    function pctToDuty(pct: number): number {
        if (pct < 0) pct = 0
        if (pct > 100) pct = 100
        return Math.round(pct * 1023 / 100)
    }

    // ===== モーター1 (P0) =====

    /**
     * モーター1（P0）をON（現在の速度%で）
     */
    //% block="モーター1 ON"
    //% weight=95
    export function motor1On(): void {
        pins.analogWritePin(AnalogPin.P0, 1023)
    }

    /**
     * モーター1（P0）をOFF
     */
    //% block="モーター1 OFF"
    //% weight=90
    export function motor1Off(): void {
        pins.analogWritePin(AnalogPin.P0, 0)
    }

    /**
     * モーター1（P0）の速度を%で設定（0–100）
     */
    //% block="モーター1 速度を %speed \\% にする"
    //% speed.min=0 speed.max=100 speed.defl=100
    //% weight=100
    export function motor1SetSpeed(speed: number): void {
        pins.analogWritePin(AnalogPin.P0, pctToDuty(speed))
    }

    /**
     * モーター1を %speed% で %ms ms 回す（その後停止）
     */
    //% block="モーター1を 速度 %speed \\% で %ms ミリ秒回す"
    //% speed.min=0 speed.max=100 speed.defl=100
    //% ms.shadow=timePicker
    //% weight=80
    export function motor1RunFor(speed: number, ms: number): void {
        pins.analogWritePin(AnalogPin.P0, pctToDuty(speed))
        basic.pause(ms)
        pins.analogWritePin(AnalogPin.P0, 0)
    }

    // ===== モーター2 (P1) =====

    /**
     * モーター2（P1）をON（現在の速度%で）
     */
    //% block="モーター2 ON"
    //% weight=75
    export function motor2On(): void {
        pins.analogWritePin(AnalogPin.P1, 1023)
    }

    /**
     * モーター2（P1）をOFF
     */
    //% block="モーター2 OFF"
    //% weight=70
    export function motor2Off(): void {
        pins.analogWritePin(AnalogPin.P1, 0)
    }

    /**
     * モーター2（P1）の速度を%で設定（0–100）
     */
    //% block="モーター2 速度を %speed \\% にする"
    //% speed.min=0 speed.max=100 speed.defl=100
    //% weight=85
    export function motor2SetSpeed(speed: number): void {
        pins.analogWritePin(AnalogPin.P1, pctToDuty(speed))
    }

    /**
     * モーター2を %speed% で %ms ms 回す（その後停止）
     */
    //% block="モーター2を 速度 %speed \\% で %ms ミリ秒回す"
    //% speed.min=0 speed.max=100 speed.defl=100
    //% ms.shadow=timePicker
    //% weight=65
    export function motor2RunFor(speed: number, ms: number): void {
        pins.analogWritePin(AnalogPin.P1, pctToDuty(speed))
        basic.pause(ms)
        pins.analogWritePin(AnalogPin.P1, 0)
    }
}
