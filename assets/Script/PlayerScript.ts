import { _decorator, Component, Node ,CCFloat, BoxCollider2D ,input, Input, RigidBody2D , Vec2, Collider2D,PhysicsSystem2D, pingPong, Vec3, EventMouse ,Camera, clamp, macro, EventTouch, Material,view ,screen, size, Screen} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerScript')
export class PlayerScript extends Component {
@property({ 
    visible: true, 
    readonly: true 
})
sectionHeader:String = "=== Player Mechanics";
@property({
    type: CCFloat,
    tooltip: "Player Horizontal Speed X-axis",
})
private horizontalSpeed = 100;
@property({
    type: CCFloat,
    tooltip: "Player Move Up Speed",
})
public playerUpForce = 0;
@property({
    type: CCFloat,
    tooltip: "Player Move Up Speed",
})
private playerDownForce = 0;
@property({
    type: CCFloat,
    tooltip: "Length of Ping Pong Effect",
})
private pingPongLength = 0;
@property({
    type: CCFloat,
    tooltip: "Speed of Ping Pong Effect",
})
private pingPongSpeed = 0;
@property(Camera)
mainCamera: Camera = null;
@property(Camera)
textureCamera: Camera = null;

@property({
    type: CCFloat,
    tooltip: "Mouse Offset"
})
private mouseOffsetX:number = 500;

@property (Material)
private Shockwave: Material = null;

@property(Vec2)
private waveOffset:Vec2 = new Vec2(0,0);
private screen:Vec2 = new Vec2(1080,1920);
///
private currentPlayerState:PlayerStates = PlayerStates.OnBounce;
public rb:RigidBody2D = new RigidBody2D();
private playerCollider:Collider2D = new Collider2D();
private inputTriggerClick  :boolean = false;
private captureGroundOffsetY: number = 0;
private oneTimeClick:boolean = false;
private oneClickOffsetf:Vec3 = new Vec3(0,0,0);
private magnitudeOffset:number = 0;
private  out = new Vec3();
private waveNum:number=0;
public onShockwave:boolean = false;
    protected onLoad(): void {
        
    }

    start() {
        input.on(Input.EventType.MOUSE_DOWN,this.OnMouseInput,this);
        input.on(Input.EventType.TOUCH_START, this.OnTouchInput, this);
        //input.on(Input.EventType.MOUSE_UP,this.OnTouchRelease,this);
        this.rb = this.node.getComponent(RigidBody2D);
        this.playerCollider = this.node.getComponent(Collider2D)
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.TOUCH_MOVE , this.onTouchMove, this);
        this.captureGroundOffsetY = this.node.position.y
        //view.enableRetina(false);
        view.setDesignResolutionSize(1080, 1920, view.getResolutionPolicy());

         screen.on('window-resize', this.onWindowResize, this);
        this.screen = new Vec2(screen.windowSize.width,screen.windowSize.height);

       // this.node.position = new Vec3(this.node.position.x,-768.01,0);

    }

    update(deltaTime: number) {
        
      //   let radians = Vec2.angle(new Vec2(this.node.worldPosition.x,this.node.worldPosition.y) ,new Vec2(this.originNode.worldPosition.x,this.originNode.worldPosition.y))
         
       // console.log("Dot Product: "+  radians * macro.DEG)
        this.PlayerStates(deltaTime);
        if(this.Shockwave)
        {
            let playerPos = new Vec3(this.node.worldPosition.x,this.node.worldPosition.y- this.waveOffset.y);
            this.mainCamera.worldToScreen(this.node.worldPosition,playerPos)
            //his.mainCamera.screenScale
            let screenPos = new Vec2(((playerPos.x / this.screen.x) ),((playerPos.y / this.screen.y)));
            this.Shockwave.setProperty('center',screenPos);
            console.log("Screen RES X:Y =  "+this.screen.x +" : "+ this.screen.y);
           this.playShockwave(0.03,deltaTime);
        }
    }

    //#region Player States
    PlayerStates(deltaTime: number)
    {
        if(this.currentPlayerState === PlayerStates.OnBounce)
        {  
            this.node.position = new Vec3(this.node.position.x,  pingPong(performance.now()*this.pingPongSpeed,this.pingPongLength)+this.captureGroundOffsetY)
            //console.log(performance.now());
        

            //Transition
            if(this.inputTriggerClick)
            {
                this.currentPlayerState = PlayerStates.OnForce;
                console.log("Player State :: From OnBounce =>  OnForce");
            }
        }
        else if(this.currentPlayerState === PlayerStates.OnForce)
        {




            //Transition
            if(!this.inputTriggerClick)
            {
               // this.currentPlayerState = PlayerStates.OnFall;
                console.log("Player State :: From OnForce =>  OnFall");
            }
        }
        else if(this.currentPlayerState === PlayerStates.OnFall)
        {



            //Transition
            if(this.inputTriggerClick)
            {
                this.currentPlayerState = PlayerStates.OnForce;
                console.log("Player State :: From OnFall =>  OnForce");
            }
            else if (this.checkForGround())
            {
                this.currentPlayerState = PlayerStates.OnBounce;
                console.log("Player State :: From OnFall => OnBounce");
                this.captureGroundOffsetY = this.node.position.y;
            }
        }
    }
    //#endregion

    //#region  Inputs
    OnTouchInput(event:EventTouch)
    {
        this.mainCamera.screenToWorld(new Vec3(event.getLocation().x,event.getLocation().y),this.oneClickOffsetf);
        this.magnitudeOffset = Vec3.distance(new Vec3 (this.node.worldPosition.x,0,0),new Vec3(this.oneClickOffsetf.x,0,0));
        if(this.oneTimeClick){return;}
        this.rb.linearVelocity = new Vec2(this.rb.linearVelocity.x,this.playerUpForce);
        this.inputTriggerClick = true;
        this.oneTimeClick = true;
    }
    OnMouseInput(event:EventMouse)
    {
        this.mainCamera.screenToWorld(new Vec3(event.getLocation().x,event.getLocation().y),this.oneClickOffsetf);
        this.magnitudeOffset = Vec3.distance(new Vec3 (this.node.worldPosition.x,0,0),new Vec3(this.oneClickOffsetf.x,0,0));
        Vec3.subtract(this.oneClickOffsetf,this.node.worldPosition,this.oneClickOffsetf)
        if(this.oneTimeClick){return;}
        this.rb.linearVelocity = new Vec2(this.rb.linearVelocity.x,this.playerUpForce);
        this.inputTriggerClick = true;
        this.oneTimeClick = true;
    }
    OnTouchRelease()
    {
        this.rb.linearVelocity = new Vec2(this.rb.linearVelocity.x,-(this.playerDownForce));
        this.inputTriggerClick = false;
    }

    onMouseMove(event: EventMouse) {
        // Get mouse position in screen space
        let screenPos:Vec2 = event.getLocation();

        // Convert screen to world
        this.mainCamera.screenToWorld( new Vec3(screenPos.x,screenPos.y),this.out);

        let  outX1 = (this.out.x-(this.mouseOffsetX-this.magnitudeOffset))*this.horizontalSpeed;
        let  outX2 = (this.out.x+(this.mouseOffsetX-this.magnitudeOffset))*this.horizontalSpeed;
        let results = this.node.worldPosition.x<this.out.x ? outX1 : outX2;
        this.node.worldPosition = new Vec3(clamp(results,0,1080)  ,this.node.worldPosition.y);
        //console.log(this.mouseOffsetX);
    }
    onTouchMove(event: EventTouch) {
        // Get mouse position in screen space
        let screenPos:Vec2 = event.getLocation();

        // Convert screen to world
        this.mainCamera.screenToWorld( new Vec3(screenPos.x,screenPos.y),this.out);
        let  outX1 = (this.out.x-(this.mouseOffsetX-this.magnitudeOffset))*this.horizontalSpeed;
        let  outX2 = (this.out.x+(this.mouseOffsetX-this.magnitudeOffset))*this.horizontalSpeed;
        let results = this.node.worldPosition.x<this.out.x ? outX2 : outX1;
        this.node.worldPosition = new Vec3(clamp(results,0,1080) ,this.node.worldPosition.y);
        //console.log(this.mouseOffsetX);
    }
    //#endregion


      onWindowResize(width: number, height: number)
       {
            console.log("Window resized:", width, height);
            this.screen = new Vec2(width,height);
       }

    
    checkForGround():boolean {
        let result = false;
        
        if (this.playerCollider) { 
            const colliderList = PhysicsSystem2D.instance.testAABB(this.playerCollider.worldAABB);
            colliderList.forEach(collider => {
                if(collider!==this.playerCollider)
                {
                  
                    if (((collider.node.layer) & (1<<0) )!==0) {
                        result = true;
                       // console.log("Colliding with obstacle"+collider.node.layer);
                    }
                }
            });
        }
       return result;
    }

    playShockwave( speedWave: number, fadeWave:number) {
        if (!this.Shockwave) return;
        
       if(this.onShockwave){
       this.waveNum+=speedWave;
        //console.log(this.waveNum);
        this.Shockwave.setProperty('shockwaveSize' ,this.waveNum);
        this.Shockwave.setProperty('shockwaveSharpness' ,this.waveNum*2);

        if(this.waveNum > 1)
        {
            this.Shockwave.setProperty('shockwaveSize' , 0);
            this.waveNum = 0;
            this.Shockwave.setProperty('shockwaveSharpness',0.2)
            this.onShockwave =false;
        }

     }
    }
    
  
}

enum PlayerStates
{
    OnBounce,
    OnFall,
    OnForce
}


