import { _decorator, BoxCollider2D, CCFloat, Component, lerp, Node, Vec2 ,Vec3 ,IPhysics2DContact ,Contact2DType,PhysicsSystem2D ,Collider2D, RenderTexture,director} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Camera')
export class Camera extends Component {
    
@property({
    type: Node,
    tooltip: "PlayerPosition"
})
private playerPosition;
@property({
    type: CCFloat,
    tooltip: "Camer Lerp Speed"
})
private smoothSpeed = 0.5;
@property({
    type:Node,
    tooltip: "UpperBound"
})
private upperBoundNode ;

@property(Camera)
renderCam: Camera = null;

@property(RenderTexture)
renderTex: RenderTexture = null;

private offset:number;
private onSetOffset:boolean = false;
    protected onLoad(): void {
      
  
    }
    start()
    {
      
        this.node.position = Vec3.ZERO;
        this.renderCam = this.node.getComponent(Camera);
        if (this.renderCam && this.renderTex)
        {
            this.renderCam.renderTex = this.renderTex;
        }
        director.addPersistRootNode(this.node);

    }                      

    update(deltaTime: number) {
        //Upper Bound
    
        if(this.playerPosition !=null && (this.playerPosition.worldPosition.y >this.upperBoundNode.worldPosition.y ||this.playerPosition.worldPosition.y >this.upperBoundNode.worldPosition.y -100 ))
        {
            if(this.onSetOffset === false)
            {
                this.offset= this.playerPosition.worldPosition.y- this.node.worldPosition.y
                this.onSetOffset = true;
                console.log("Offset: ===>>"+this.offset);
            }
            //this.node.worldPosition =  new Vec3(this.node.worldPosition.x,(this.playerPosition.worldPosition.y)) ;// +this.offset;

             this.node.worldPosition =  new Vec3(this.node.worldPosition.x,lerp(this.node.worldPosition.y,this.playerPosition.worldPosition.y-this.offset,this.smoothSpeed),0) ;// +this.offset;
        }
        else{this.onSetOffset = false;}
        // {
           
         //Down Bound

    }
}


