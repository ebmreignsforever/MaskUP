import { _decorator, Collider2D, Component, Node ,IPhysics2DContact,Contact2DType} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ReturnPoolObject')
export class ReturnPoolObject extends Component {



    private Collider:Collider2D;
    start() {
        this.Collider = this.node.getComponent(Collider2D)
        this.Collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    update(deltaTime: number) {
        
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // will be called once when two colliders begin to contact
        console.log('onBeginContact Destroy');

        if(otherCollider.node.name == "Ground")
        {
            otherCollider.node.active = false;
           
        }
    }
}


