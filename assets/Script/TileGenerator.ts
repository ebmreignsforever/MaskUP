import { _decorator, Component, instantiate, Node, Prefab, Vec2, Vec3,Layers ,find,PhysicsSystem2D,BoxCollider2D, CCFloat, CCInteger, Collider2D, randomRange,Animation} from 'cc';
import { ObjectPool } from './ObjectPool';
const { ccclass, property } = _decorator;

@ccclass('TileGenerator')
export class TileGenerator extends Component {



@property({
    type: Node,
    tooltip: "ObjectPoll"
})
private objectPoolNode: Node;

@property({
    type: Node,
    tooltip: "PlayerPosition"
})
private playerNode: Node;
@property({
    type: CCFloat,
    tooltip: "Spacing between spawns"
})
private Space = 500;
private playerSpaceOffset = 0;
private playerSpaceTrack = 0;
private ObjectPoolref:ObjectPool ;
    protected start(): void {
        this.ObjectPoolref = this.objectPoolNode.getComponent(ObjectPool)
        this.playerSpaceOffset = this.playerNode.worldPosition.y;
    }
    protected update(dt: number): void {
        this.playerSpaceTrack =  this.playerNode.worldPosition.y - this.playerSpaceOffset;
        if(this.ObjectPoolref!=null)
        {
            if(this.playerSpaceTrack > this.Space)
            {
                let node =  this.ObjectPoolref.GetPoolObject("Ground")
                if(node!=null)
                {
                    node.setWorldPosition(randomRange(150,900),this.playerNode.worldPosition.y+this.Space,0)
                    node.getChildByName("mask").getComponent(Collider2D).apply();
                    let colliders = node.getComponents(Collider2D);
                    colliders.forEach(collider => {
                        collider.apply();  // Apply updates to each collider
                        console.log("Collider offset at: "+collider.offset)

                    });

                    let anim = node.getComponent(Animation);
                    if (anim) {
                        anim.stop()
                        anim.play("GroundIdle"); // or any other method
                        
                    }
                }
                this.playerSpaceOffset = this.playerNode.worldPosition.y;
            }

           // let node =  this.ObjectPoolref.GetPoolObject("Ground")
           //
                
        }
    }


}


