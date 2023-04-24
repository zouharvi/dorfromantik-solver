export const HEX_r = 40;
export const HEX_R = Math.sqrt(3) / 2 * HEX_r
export const HEX_MAIN_r = 70;
export const HEX_MAIN_R = Math.sqrt(3) / 2 * HEX_MAIN_r

enum HEX_STATE {
    PLAIN,
    TREE,
    FIELD,
    CITY,
}
let HEX_STATE_COLORS : {[state in HEX_STATE]: number} = {
    [HEX_STATE.PLAIN]: 0xd6d7b3,
    [HEX_STATE.TREE]: 0x4b8051,
    [HEX_STATE.FIELD]: 0x9e9c39,
    [HEX_STATE.CITY]: 0x9e5339,
}
let HEX_STATE_TRANSITION : {[state in HEX_STATE]: number} = {
    [HEX_STATE.PLAIN]: HEX_STATE.TREE,
    [HEX_STATE.TREE]: HEX_STATE.FIELD,
    [HEX_STATE.FIELD]: HEX_STATE.CITY,
    [HEX_STATE.CITY]: HEX_STATE.PLAIN,
}

class _HexFactory {

    public createHex(x, y, scene: Phaser.Scene): void {
        // sillouethe
        let sillouethe = scene.add.polygon(
            x, y,
            [
                [0, 0 + HEX_R], [0.5 * HEX_r, -HEX_R + HEX_R], [1.5 * HEX_r, -HEX_R + HEX_R],
                [2 * HEX_r, 0 + HEX_R], [1.5 * HEX_r, HEX_R + HEX_R], [0.5 * HEX_r, HEX_R + HEX_R],
            ],
            0x000000, 1
        )
        sillouethe.setStrokeStyle(4, 0x00A040, 1.0)

        for (let i = 0; i < 6; i++) {
            let triangle = scene.add.triangle(
                x, y,
                0 + HEX_r / 2, 0 + HEX_R, -HEX_r / 2 + HEX_r / 2, -HEX_R + HEX_R, HEX_r / 2 + HEX_r / 2, -HEX_R + HEX_R,
                0x00ff00, 1
            )
            triangle.setOrigin(0.5, 1.0)
            triangle.setRotation(2 * Math.PI * i / 6)
        }
    }

    public createMainHex(x, y, scene: Phaser.Scene): void {
        // sillouethe
        let sillouethe = scene.add.polygon(
            x, y,
            [
                [0, 0 + HEX_MAIN_R], [0.5 * HEX_MAIN_r, -HEX_MAIN_R + HEX_MAIN_R], [1.5 * HEX_MAIN_r, -HEX_MAIN_R + HEX_MAIN_R],
                [2 * HEX_MAIN_r, 0 + HEX_MAIN_R], [1.5 * HEX_MAIN_r, HEX_MAIN_R + HEX_MAIN_R], [0.5 * HEX_MAIN_r, HEX_MAIN_R + HEX_MAIN_R],
            ],
            0xA0C0C0, 1
        )
        sillouethe.setScale(1.03, 1.03)
        // sillouethe.strokeAlpha(1.0)
        sillouethe.setStrokeStyle(4, 0x00A040, 1.0)

        let states = new Array(6)
        
        for (let i = 0; i < 6; i++) {
            states[i] = HEX_STATE.PLAIN
            
            let triangle = scene.add.triangle(
                x, y,
                0 + HEX_MAIN_r / 2, 0 + HEX_MAIN_R, -HEX_MAIN_r / 2 + HEX_MAIN_r / 2, -HEX_MAIN_R + HEX_MAIN_R, HEX_MAIN_r / 2 + HEX_MAIN_r / 2, -HEX_MAIN_R + HEX_MAIN_R,
                0x00ff00, 1
            )
            triangle.setOrigin(0.5, 1.0)
            triangle.setRotation(2 * Math.PI * i / 6)


            let triangle_hidden = scene.add.triangle(
                x, y,
                0 + HEX_MAIN_r / 2, 0 + HEX_MAIN_R, -HEX_MAIN_r / 2 + HEX_MAIN_r / 2, -HEX_MAIN_R + HEX_MAIN_R - HEX_MAIN_R, HEX_MAIN_r / 2 + HEX_MAIN_r / 2, -HEX_MAIN_R + HEX_MAIN_R - HEX_MAIN_R,
                0x0000ff, 0.0
            )
            triangle_hidden.setScale(0.5, 0.5)
            triangle_hidden.setOrigin(0.5, 1.0)
            triangle_hidden.setRotation(2 * Math.PI * i / 6)

            triangle_hidden.setInteractive()

            triangle_hidden.on("pointerover", (event) => {
                triangle.setAlpha(0.8)
                console.log("CLICKED!")
            })
            triangle_hidden.on("pointerdown", (event) => {
                states[i] = HEX_STATE_TRANSITION[states[i]]
                triangle.setFillStyle(HEX_STATE_COLORS[states[i]], 0.8)
            })
            triangle_hidden.on("pointerout", () => {
                triangle.setAlpha(1.0)
                console.log("CLICKED OUT!")
            })

            // scene.physics.add.existing(triangle_hidden)
        }


        // let triangle = scene.add.triangle(200, 200, 0, 0, 100, 0, 0, 100, 0xff0000, 1)
        // triangle.fillColor = 0x0000ff;
        // scene.physics.add.existing(triangle)


        // hex.setInteractive()
        // let hex = scene.add.group()
        // triangle.setPosition(100, 100)

        // hex.shiftPosition(x, y)
        // return hex
    }

}

export let HexFactory = new _HexFactory()