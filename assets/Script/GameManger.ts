import { _decorator, CCString, Collider2D, Component, Node, Contact2DType ,IPhysics2DContact, RichText, CCFloat, Vec2,RigidBody2D, Material,Animation ,game,Game ,math , resources, Sprite, Color , AudioSource ,AudioClip ,director, ParticleSystem2D, BoxCollider2D, Vec4, Vec3 } from 'cc';
import { PlayerScript } from './PlayerScript';
const { ccclass, property } = _decorator;

@ccclass('GameManger')
export class  GameManger extends Component {

    public static instance:GameManger;


      //UI Properties
      @property({ 
        visible: true, 
        readonly: true 
    })
    sectionHeader:String = "===UI Properties";

      @property({
        type:Node,
        tooltip:"Player Score Counter"
      })
      private playerscoreNode;
      
      @property({
        type:Node,
        tooltip:"Player Score Counter"
      })
      private playerHighscoreNode;

      @property(Node)
      private repaly:Node;
      
    
      //InGame NOdes reference
      @property({
        type:Node,
        tooltip:"Player NOde"
      })
      private playerNode:Node;
      @property({
        type:Node,
        tooltip:"Player NOde"
      })
      private backGroundNode;

      @property({
        type:CCFloat,
        tooltip:"Player Increase Force"
      })
      private increaseForce:number = 2;

      @property(Node)
      private CameraNode:Node;

    //Prefab References
    @property(Node)
    public colliderNode;
    

    @property(Material)
    private uvOffset:Material;
    @property(Material)
    private wave:Material;

    @property(AudioSource)
    private hitSource;

    @property(ParticleSystem2D)
    private burst:ParticleSystem2D;
    @property(ParticleSystem2D)
    private death:ParticleSystem2D;

    @property(Node)
    private EndEffect:Node;

    @property(Node)
    private EndWave:Node;
    //player Data
    private score:number = 0;

    private playerCollider:Collider2D;

    public  PlayerData = {id: "Null" , highScore: 0}
    protected onLoad(): void { 
       // this.node = director.getScene();
       
        if (!GameManger.instance) {
            GameManger.instance = this;
           // director.addPersistRootNode(this.node);
            
        }
        else
        {
            this.destroy()
        }
        //localStorage.setItem('playerHighscore', '0000');
        var saved = localStorage.getItem('playerHighscore');

        if (saved === null) {
            
            localStorage.setItem('playerHighscore', '0000');
            console.log('Data saved!');
        } else {
            // Key already exists
            console.log('Data already exists:');
            saved = localStorage.getItem('playerHighscore');
            const highScoreTxt = this.playerHighscoreNode.getComponent(RichText);
            highScoreTxt.string = saved.toString();
        }
        

    }
    start() {


        this.loadOnPlay();
       // director.addPersistRootNode(this.node);
        director.preloadScene("MainScene", function () {
            console.log('Next scene preloaded');
        });
        this.EndWave.active = false;

    }

    update(deltaTime: number) {
        this.uvOffset.setProperty('time',performance.now());
        this.wave.setProperty('time',performance.now());
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // will be called once when two colliders begin to contact
        
        if(otherCollider.node.name === "mask")
        {
            this.score++;
             this.node.children.forEach((child)=>
                {
                    child.getComponent(Sprite).color = Color.RED;
                });
                this.hitSource.play();
            const richText = this.playerscoreNode.getComponent(RichText);
          
            if (richText) {
                richText.string = this.score.toString();
            }
            

            let anim = otherCollider.node.parent.getComponent(Animation);
            if (anim) {
                anim.play("GroundBurst"); // or any other method
                
            }

        
            if(this.burst)
            {
                //this.burst.
                this.burst.resetSystem();
            }
            
        
            let rb = this.playerNode.getComponent(RigidBody2D);
            rb.linearVelocity = new Vec2(rb.linearVelocity.x, math.clamp(rb.linearVelocity.y+this.increaseForce,0,80));
            this.playerCollider.getComponent(PlayerScript).onShockwave = true;
        }

        if(otherCollider.node.name =="Ground")
        {
            const scoreTxt = this.playerscoreNode.getComponent(RichText);
            const highScoreTxt = this.playerHighscoreNode.getComponent(RichText);
            const savedHigh = localStorage.getItem('playerHighscore');
            this.hitSource.play();
            if(parseInt(savedHigh.toString())<parseInt(scoreTxt.string))
            {
                highScoreTxt.string = scoreTxt.string;
                localStorage.setItem('playerHighscore', scoreTxt.string);
            }
            //director.addPersistRootNode(this.node.parent);
            //director.loadScene('MainScene');
            //director.loadScene('Bridge');
            if(this.death)
            {
                this.death.resetSystem();
            }
            this.playerNode.getChildByName('Sprite').active = false;
            // this.playerNode.components.forEach((component) => 
            //     {
            //         if(component.name =="PlayerScript")
            //         {
            //             component.enabled == false;
            //         }
            //     });
            //this.playerNode.getComponent(PlayerScript).enabled = false;
            //this.playerNode.getComponent(RigidBody2D).linearVelocity = Vec2.ZERO;
            this.playerNode.getComponent(BoxCollider2D).enabled = false;
            this.playerNode.getComponent(RigidBody2D).enabled = false;
            this.repaly.active = true;


           
            this.EndWave.active = true;
            this.EndEffect.active = true;
            this.EndEffect.getComponent(Animation).play('EndEffect');
           // this.node.getComponent(AudioSource).p
        }
     
    }

    public OnReplay()
    {
        // this.playerNode.getComponent(BoxCollider2D).enabled = true;
        // this.playerNode.getChildByName('Sprite').active = true;
        // this.playerNode.worldPosition = new Vec3(-26.75,-768.4,1);
        // this.CameraNode.worldPosition = new Vec3(0,0,0);
       //.linearVelocity = Vec2.ZERO;
        this.repaly.active = false;
        this.EndWave.active = false;
        this.EndEffect.active = false;
       // this.destroy();
        director.loadScene('MainScene' ,() => {
            //this.loadOnPlay(); // This runs AFTER the scene has fully loaded
            console.log("This runs AFTER the scene has fully loaded");
          
    
        });
       GameManger.instance = null;

    }

    loadOnPlay()
    {
        this.playerCollider = this.playerNode.getComponent(Collider2D);
        if(this.playerCollider)
        {
            this.playerCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

          game.frameRate = 60;
      //  this.node.getComponent(AudioSource).play();
       
    }
}


