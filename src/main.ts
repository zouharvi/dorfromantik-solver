import * as Phaser from 'phaser';
// import * from './hex_factory';
import './hex_factory'
import { HexFactory, HEX_STATE, HEX_R, HEX_r, main_hex_states, PACKED_HEX_STATE } from './hex_factory';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: false,
    key: 'Game',
};


let HexMap = new Array<Array<PACKED_HEX_STATE>>()

// fill with empty
for (let j = 0; j < 20; j++) {
    let single_row = new Array<PACKED_HEX_STATE>()
    for (let i = 0; i < 50; i++) {
        single_row.push(null)
    }
    HexMap.push(single_row)
}
// set to placeholder
HexMap[1][0] = 0
HexMap[2][1] = 0
HexMap[2][2] = 0
HexMap[3][1] = 0
HexMap[3][2] = 0
HexMap[4][3] = 0
HexMap[5][3] = 0
HexMap[5][4] = 0

const PLACEHOLDER_NEIGHBOURS_EVEN = [
    // [-1, -1],
    //  [0, -2],
    // [-1, +1], [0, +1], [0, +2],
    [-1, -1], [0, -1], [0, -2],
    [-1, +1], [0, +1], [0, +2],
]

const PLACEHOLDER_NEIGHBOURS_ODD = [
    // [-1, -1],
    //  [0, -2],
    // [-1, +1], [0, +1], [0, +2],
    [0, -1], [+1, -1], [0, -2],
    [0, +1], [+1, +1], [0, +2],
]

export class GameScene extends Phaser.Scene {
    private hex_group: Phaser.GameObjects.Group;

    constructor() {
        super(sceneConfig);
    }

    public preload() {
        console.log("PRELOAD?")
    }

    public redraw() {
        if (this.hex_group != null) {
            this.hex_group.destroy(true)
        }
        this.hex_group = this.add.group()


        for (let j = 0; j < HexMap.length; j++) {
            let line = ""
            for (let i = 0; i < HexMap[j].length; i++) {
                if (HexMap[j][i] == null) {
                    line += "."
                } else if (HexMap[j][i] == 0) {
                    line += "0"
                } else {
                    line += "x"
                }
            }
            console.log(line, Math.random())
        }

        for (let j = 0; j < HexMap.length; j++) {
            for (let i = 0; i < HexMap[j].length; i++) {
                let loc_x = 3 * HEX_r * i + (j % 2 == 1 ? 1.5 * HEX_r : 0)
                let loc_y = HEX_R * j

                let obj = HexMap[j][i]
                if (obj == null) {

                } else if (obj == 0) {
                    this.add.text(loc_x, loc_y, `${i} ${j}`).setAlign("center").setColor("black")
                    let hex = HexFactory.createHexEmpty(
                        loc_x, loc_y, this,
                        () => {
                            HexMap[j][i] = [...main_hex_states]

                            // create placeholders around if they don't exist
                            let offset_j = 0
                            let offset_i = 0

                            console.log(j)
                            let neighbours = PLACEHOLDER_NEIGHBOURS_EVEN
                            if (j % 2 == 1) {
                                neighbours = PLACEHOLDER_NEIGHBOURS_ODD
                                console.log("That's me")
                            }
                            if (j <= 1) {
                                // create new row with current array length
                                let single_row = new Array<PACKED_HEX_STATE>()
                                for (let i_ = 0; i_ < HexMap[0].length; i_++) {
                                    single_row.push(null)
                                }
                                HexMap.unshift(single_row)
                                offset_j += 1

                                // repeat twice
                                if (j == 0) {
                                    // create new row with current array length
                                    let single_row = new Array<PACKED_HEX_STATE>()
                                    for (let i_ = 0; i_ < HexMap[0].length; i_++) {
                                        single_row.push(null)
                                    }
                                    HexMap.unshift(single_row)
                                    offset_j += 1
                                }
                            }
                            if (i <= 0) {
                                // add a new element to the left
                                for (let j_ = 0; j_ < HexMap.length; j_++) {
                                    HexMap[j_].unshift(null)
                                }
                                offset_i += 1
                            }
                            console.log("I'm", i + offset_i, j + offset_j)
                            neighbours.forEach((el) => {
                                let new_i = i + el[0] + offset_i
                                let new_j = j + el[1] + offset_j
                                console.log("setting", new_i, new_j, el)
                                if (HexMap[new_j][new_i] == null) {
                                    HexMap[new_j][new_i] = 0
                                }
                            });

                            console.log(HexMap)

                            this.redraw()
                        }
                    )
                    this.hex_group.add(hex)
                } else {
                    let hex_triangles = HexFactory.createHex(
                        loc_x, loc_y, obj, this
                    )
                    this.add.text(loc_x, loc_y, `${i} ${j}`).setAlign("center").setColor("black")
                    hex_triangles.forEach((triangle) => {
                        this.hex_group.add(triangle)
                    })
                }
            }
        }

    }

    public create() {
        HexFactory.createMainHex(700, 500, this)

        this.redraw()
        // for (let i = 0; i < 3; i++) {
        //     for (let j = 0; j < 5; j++) {
        //         let hex = HexFactory.createHexEmpty(
        //             200 + 3 * HEX_r * i + (j % 2 == 0 ? - 1.5*HEX_r : 0),
        //             300 + HEX_R * j, this
        //         )
        //     }
        // }

        // let hex = HexFactory.createHex(
        //         200 + 3 * HEX_r * i + (j % 2 == 0 ? - 1.5*HEX_r : 0),
        //         300 + HEX_R * j,
        //         this
        // )
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