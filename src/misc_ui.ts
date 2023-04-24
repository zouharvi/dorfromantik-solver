class _UIFactory {
    public createRotate(scene: Phaser.Scene) {
        let x = 660
        let y = 570
        let button = scene.add.rectangle(x, y, 40, 40, 0xAAAAAA).setStrokeStyle(4, 0x90B0B0, 1.0)
        scene.add.text(x-13, y-15, "↻").setColor("#0x222222").setFontSize("28px").setFontFamily("Georgia")
    }


    public createAutoRotate(scene: Phaser.Scene) {
        let x = 730
        let y = 570
        let button = scene.add.rectangle(x, y, 70, 40, 0xAAAAAA).setStrokeStyle(4, 0x90B0B0, 1.0)
        scene.add.text(x-22, y-18, "auto\nrotate").setColor("#0x222222").setFontSize("15px").setFontFamily("Georgia").setAlign("center")
    }
}

export var UIFactory = new _UIFactory()