import { _decorator, Component, RenderTexture, SpriteFrame, Sprite, Camera, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RenderTextureSprite')
export class RenderTextureSprite extends Component {
    @property(Sprite)
    sprite: Sprite = null!;

    @property(Camera)
    camera: Camera = null!;

    private _renderTex: RenderTexture = null!;

    start() {
        this.camera = this.node.getComponent(Camera);
        const width = 1024;
        const height = 1024;

        // Create RenderTexture
        const renderTex = new RenderTexture();
        renderTex.reset({ width, height });
        renderTex.initialize;

        // Assign it to the camera
        this.camera.targetTexture = renderTex;

        // Create a new SpriteFrame using that texture
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = renderTex;

        // Set the sprite to use this frame
        this.sprite.spriteFrame = spriteFrame;

        // Optional: match size of the sprite to the texture
        this.sprite.getComponent(UITransform)!.setContentSize(width, height);
    }
}
