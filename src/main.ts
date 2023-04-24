import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: false,
    key: 'Game',
};

const HEX_r = 50;
const HEX_R = Math.sqrt(3) / 2 * HEX_r

function createHex(x, y, scene: Phaser.Scene): void  {
    // sillouethe
    let sillouethe = scene.add.polygon(
        x, y,
        [
            [0, 0+HEX_R], [0.5 * HEX_r, -HEX_R+HEX_R], [1.5 * HEX_r, -HEX_R+HEX_R],
            [2 * HEX_r, 0+HEX_R], [1.5 * HEX_r, HEX_R+HEX_R], [0.5 * HEX_r, HEX_R+HEX_R],
        ],
        0x000000, 1
    )
    // sillouethe.strokeAlpha(1.0)
    sillouethe.setStrokeStyle(4, 0x00A040, 1.0)

    for (let i = 0; i < 6; i++) {
        let triangle = scene.add.triangle(
            x, y,
            0 + HEX_r / 2, 0 + HEX_R, -HEX_r / 2 + HEX_r / 2, -HEX_R + HEX_R, HEX_r / 2 + HEX_r / 2, -HEX_R + HEX_R,
            0x00ff00, 1
        )
        triangle.setOrigin(0.5, 1.0)
        triangle.setRotation(2 * Math.PI * i / 6)


        let triangle_hidden = scene.add.triangle(
            x, y,
            0 + HEX_r / 2, 0 + HEX_R, -HEX_r / 2 + HEX_r / 2, -HEX_R + HEX_R - HEX_R, HEX_r / 2 + HEX_r / 2, -HEX_R + HEX_R - HEX_R,
            0x0000ff, 0.0
        )
        triangle_hidden.setScale(0.5, 0.5)
        triangle_hidden.setOrigin(0.5, 1.0)
        triangle_hidden.setRotation(2 * Math.PI * i / 6)

        triangle_hidden.setInteractive()

        triangle_hidden.on("pointerover", (event) => {
            triangle.setFillStyle(0xff0000, 0.8)
            console.log("CLICKED!")
        })
        triangle_hidden.on("pointerout", () => {
            triangle.setFillStyle(0x00ff00, 1.0)
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


export class GameScene extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }

    public preload() {
        console.log("PRELOAD?")
    }

    public create() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                let hex = createHex(
                    200 + 3 * HEX_r * i + (j % 2 == 0 ? - 1.5*HEX_r : 0),
                    300 + HEX_R * j, this
                )
            }
        }
    }

    public update() {
        // TODO
    }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Dorfromantik Solver',

    scene: GameScene,
    type: Phaser.AUTO,

    scale: {
        width: 800,
        height: 600,
    },
    // physics: {
    //     default: 'arcade',
    //     arcade: {
    //         debug: true,
    //     },
    // },


    parent: 'game-content',
    backgroundColor: '#000000',
};

export const game = new Phaser.Game(gameConfig);