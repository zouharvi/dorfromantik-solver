import * as Phaser from 'phaser';
// import * from './hex_factory';
import './hex_factory'
import { HexFactory, HEX_R, HEX_r } from './hex_factory';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }

    public preload() {
        console.log("PRELOAD?")
    }

    public create() {
        HexFactory.createMainHex(700, 400, this)

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                let hex = HexFactory.createHex(
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
    backgroundColor: '#ACC',
};

export const game = new Phaser.Game(gameConfig);