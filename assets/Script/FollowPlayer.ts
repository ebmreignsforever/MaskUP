import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FollowPlayer')
export class FollowPlayer extends Component {
    @property(Node)
    private playerNode;
    start() {

    }

    update(deltaTime: number) {
        this.node.worldPosition = this.playerNode.worldPosition;
    }
}


