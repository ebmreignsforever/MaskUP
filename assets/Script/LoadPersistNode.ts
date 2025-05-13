import { _decorator, Component, Node,  director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadPersistNode')
export class LoadPersistNode extends Component {
    protected onLoad(): void {
       
    }
    start() {
        director.loadScene('MainScene');
    }

    update(deltaTime: number) {
        
    }
}


