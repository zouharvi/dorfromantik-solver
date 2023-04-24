import * as Phaser from 'phaser';
// import * from './hex_factory';
import './hex_factory'
import { UIFactory, AUTOROTATE_ON } from './misc_ui';
import { MapDrawer } from './map_drawer';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: false,
    key: 'Game',
};

export class GameUIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gameui', active: true });
    }

    public create() {
        UIFactory.createRotate(this)
        UIFactory.createAutoRotate(this)
        UIFactory.createMainHex(this)
    }
}

export let global_redraw_map : () => void;

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'game', active: true });
    }

    public create() {
        UIFactory.handleCamera(this)

        global_redraw_map = () => {
            MapDrawer.redraw_map(this)
        }
        global_redraw_map()
    }

    public update() {
        // TODO
    }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Dorfromantik Solver',

    scene: [GameScene, GameUIScene],
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