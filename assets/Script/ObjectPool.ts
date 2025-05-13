import { _decorator, Component, Node, Prefab ,CCInteger, CCString, instantiate ,Vec2,BoxCollider2D} from 'cc';
//import { } from './ObjecPool';
const { ccclass, property } = _decorator;

@ccclass('PoolContainer')
export class PoolContainer {
   @property({
       type: Prefab,
       tooltip: 'Prefab Object for Pooling',
   })
   tileObject: Prefab = new Prefab();

   @property({
       type: CCInteger,
       tooltip: "ObjectPool Size"
   })
   poolSize = 10;

   @property({
    type: CCString,
    tooltip: "ObjectPool Size"
})
  PoolName = "Empty";
   
}


@ccclass('ObjectPool')
export class ObjectPool extends Component {
@property({ type: [PoolContainer], tooltip: "List of objects to pool" })
objectsToPool: PoolContainer[] = [];
private indexTrack:Map<string, number> = new Map();
public PoolList:Map<string, Node[]> = new Map();

    protected onLoad(): void {
        this.InitializePool();
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
    InitializePool()
    {
        for (let i = 0; i < this.objectsToPool.length; i++) {
            this.PoolList.set(this.objectsToPool[i].PoolName,[]);
            this.indexTrack.set(this.objectsToPool[i].PoolName,0);
            for (let j = 0 ;  j < this.objectsToPool[i].poolSize ;j++) {
                if(this.objectsToPool[i].tileObject === null){console.log("Pool Index "+i+": --is Empty attach a prefab ");return;}
                let node:Node = instantiate(this.objectsToPool[i].tileObject);
                 node.parent = this.node;
                       node.setWorldPosition(700,500,0);
                       node.active =false;
                       const collider = node.getComponent(BoxCollider2D);
                        if (collider) {
                            //collider.offset = new Vec2(0, 0); // or whatever default you expect
                            collider.apply();
                        }
                this.PoolList.get(this.objectsToPool[i].PoolName).push(node);

            }
            console.log("Pool:"+i+" ---"+ this.PoolList.get(this.objectsToPool[i].PoolName).length);
          
            
        }

    }
    GetPoolObject(PoolName:string):Node
    {
        if(this.PoolList.has(PoolName))
        {
             // Check if Index Track value is accurate

             //Return is pool is full
             if(this.indexTrack.get(PoolName) ===this.PoolList.get(PoolName).length)
                {
                    //Check for emptyPool
                    for (let index = 0; index <this.PoolList.get(PoolName).length; index++) {
                        
                        if(this.PoolList.get(PoolName)[index].active === false)
                        {
                            this.indexTrack.set(PoolName , index);
                            break;
                        }
                        else
                        {
                            return null;
                        }
                    }
                     
                }
             if(this.PoolList.get(PoolName)[this.indexTrack.get(PoolName)].active === false)
            {
                let node = this.PoolList.get(PoolName)[this.indexTrack.get(PoolName)];
                let currentIndex = this.indexTrack.get(PoolName);
                this.indexTrack.set(PoolName , currentIndex+1);
                node.active = true;
                //if last Element
                return node;
                
            }
            else
            {
                return null;
            }
            

        }
        else
        {
            console.log("Pool Name not found");
            return null;
        }
   
        return null;
    }
    ReturnPoolObject()
    {

    }
    
}


