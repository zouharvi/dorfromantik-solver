
import { main_hex_state, HEX_MAIN_R, HEX_MAIN_r, HEX_STATE, HEX_STATE_COLORS, HEX_STATE_TRANSITION } from './hex_factory';
import { global_redraw_map } from './main';
export let AUTOROTATE_ON = true

class _UIFactory {
    public createRotate(scene: Phaser.Scene) {
        let x = 660
        let y = 570
        let button = scene.add.rectangle(x, y, 40, 40, 0xAAAAAA).setStrokeStyle(4, 0x90B0B0, 1.0)
        scene.add.text(x - 13, y - 15, "↻").setColor("#0x222222").setFontSize("28px").setFontFamily("Georgia").setScrollFactor(0)
        // fix to camera
        button.setScrollFactor(0)
        button.setInteractive()

        button.on("pointerover", (event) => {
            button.setAlpha(0.8)
        })
        button.on("pointerout", () => {
            button.setAlpha(1.0)
        })
        let switch_fn = () => {
            // rotate array
            main_hex_state.unshift(main_hex_state.pop())
            this.rotateMainHex()

            global_redraw_map()
        }
        button.on("pointerdown", switch_fn)
        scene.input.keyboard.on('keydown', (event) => { if (event.code == "KeyR") switch_fn() });
    }


    public createAutoRotate(scene: Phaser.Scene) {
        let x = 730
        let y = 570
        let button = scene.add.rectangle(x, y, 70, 40, 0xAACCAA).setStrokeStyle(4, 0x90B0B0, 1.0)
        scene.add.text(x - 22, y - 18, "auto\nrotate").setColor("#0x222222").setFontSize("15px").setFontFamily("Georgia").setAlign("center").setScrollFactor(0)
        // fix to camera
        button.setScrollFactor(0)
        
        button.setInteractive()
        button.on("pointerover", (event) => {
            button.setAlpha(0.8)
        })
        button.on("pointerout", () => {
            button.setAlpha(1.0)
        })

        let switch_fn = () => {
            AUTOROTATE_ON = !AUTOROTATE_ON
            if (AUTOROTATE_ON) {
                button.setFillStyle(0xAACCAA, 0.8)
            } else {
                button.setFillStyle(0xCCAAAA, 0.8)
            }
            
            global_redraw_map()
        }
        button.on("pointerdown", switch_fn)
        scene.input.keyboard.on('keydown', (event) => { if (event.code == "KeyA") switch_fn() });
    }

    public handleCamera(scene: Phaser.Scene) {
        var cam = scene.cameras.main;
        // cam.setBounds(0, 0, map.displayWidth, map.displayHeight);
        cam.setZoom(1.0);
        scene.input.on("pointermove", function (p) {
            if (!p.isDown) return;

            cam.scrollX -= (p.x - p.prevPosition.x) / cam.zoom;
            cam.scrollY -= (p.y - p.prevPosition.y) / cam.zoom;
        });
        scene.input.on('wheel',
            (pointer, currentlyOver, dx, dy, dz, event) => {
                console.log(cam.zoom, dy)
                cam.setZoom(Math.min(Math.max(cam.zoom - dy / 1000, 0.2), 1))
            });

    }

  
    public main_triangles_hidden = new Array()
    public main_triangles = new Array()


    public createMainHex(scene: Phaser.Scene): void {
        let x = 700
        let y = 470
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
        sillouethe.setStrokeStyle(4, 0x90B0B0, 1.0)
        sillouethe.setScrollFactor(0)

        for (let i = 0; i < 6; i++) {

            let triangle = scene.add.triangle(
                x, y,
                0 + HEX_MAIN_r / 2, 0 + HEX_MAIN_R, -HEX_MAIN_r / 2 + HEX_MAIN_r / 2, -HEX_MAIN_R + HEX_MAIN_R, HEX_MAIN_r / 2 + HEX_MAIN_r / 2, -HEX_MAIN_R + HEX_MAIN_R,
                HEX_STATE_COLORS[main_hex_state[i]], 1
            )
            triangle.setOrigin(0.5, 1.0)
            triangle.setRotation(2 * Math.PI * i / 6)

            triangle.setScrollFactor(0)
            this.main_triangles.push(triangle)


            let triangle_hidden = scene.add.triangle(
                x, y,
                0 + HEX_MAIN_r / 2, 0 + HEX_MAIN_R, -HEX_MAIN_r / 2 + HEX_MAIN_r / 2, -HEX_MAIN_R + HEX_MAIN_R - HEX_MAIN_R, HEX_MAIN_r / 2 + HEX_MAIN_r / 2, -HEX_MAIN_R + HEX_MAIN_R - HEX_MAIN_R,
                0x000000, 0.0
            )
            triangle_hidden.setScale(0.5, 0.5)
            triangle_hidden.setOrigin(0.5, 1.0)
            triangle_hidden.setRotation(2 * Math.PI * i / 6)
            triangle_hidden.setScrollFactor(0)
            this.main_triangles_hidden.push(triangle_hidden)


            triangle_hidden.setInteractive()

            triangle_hidden.on("pointerover", (event) => {
                triangle.setAlpha(0.8)
            })
            triangle_hidden.on("pointerdown", (event) => {
                main_hex_state[i] = HEX_STATE_TRANSITION[main_hex_state[i]]
                triangle.setFillStyle(HEX_STATE_COLORS[main_hex_state[i]], 1)
                
                global_redraw_map()
            })
            triangle_hidden.on("pointerout", () => {
                triangle.setAlpha(1.0)
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


    public rotateMainHex() {
        this.main_triangles.forEach((triangle) => { triangle.rotation += 2 * Math.PI / 6 })
        this.main_triangles_hidden.forEach((triangle) => { triangle.rotation += 2 * Math.PI / 6 })
    }

}

export var UIFactory = new _UIFactory()