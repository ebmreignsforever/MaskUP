 import { _decorator, Button, Component , EditBox, Node ,resources,JsonAsset } from 'cc';
  const { ccclass , property } = _decorator;
  @ccclass('LeaderBoard')
  export class LeaderBoard extends Component {
@property({
   type:Node,
   tooltip : "TextBox"
})
private textboxNode;
@property({
   type:Node,
   tooltip : "submitButton"
})
private submitButtonNode;
private jsonPlayerData;
private textbox:EditBox;
//private data = require('./data.json');
    protected start(): void {
      let submitButton:Button = this.getComponent(Button);
      this.textbox = this.textboxNode.getComponent(EditBox);
      //Deserialize data
     // this.resetLocalStorage();
      resources.load('PlayerData', JsonAsset, (err, jsonAsset) => {
        if (err) {
            console.error('Failed to load JSON:', err);
            return;
        }

        //Create a local Data for Json 
        const saved = localStorage.getItem('playerData');
        if (saved === null) {
            // Key doesn't exist — safe to create
            //const data = jsonAsset.json;
            this.jsonPlayerData = jsonAsset.json;
            localStorage.setItem('playerData', JSON.stringify(this.jsonPlayerData));
            console.log('Data saved!');
        } else {
            // Key already exists
            console.log('Data already exists:', JSON.parse(saved));
        }

    
       // data.id = "Player 1";
       // data.highscore = 100;
      //  console.log('Player Name:', data.id);
       // console.log('Score:', data.highscore);


       // localStorage.setItem('playerData', JSON.stringify(data));
        //const saved = localStorage.getItem('playerData');
    });
    }
    async submitScore() {
      let  playerName: string;
      let score: number = 50;
      if(this.textbox!=null)
      {
         playerName = this.textbox.string;
      }
    
      if (!window.firebase?.app) {
        console.error('Firebase DB not found');
        return;
      }
       const doc  = await window.firebase.addDoc(window.firebase.collection(window.firebase.db, 'LeaderBoard'), {
        name: playerName,
        score: score,
        timestamp: Date.now()
      });

      console.log("Collection ID: "+doc.id);
     
      if(doc!=null)
      {
        const saved = localStorage.getItem('playerData');
        let parsed = saved ? JSON.parse(saved) : {};
        console.log("Parsed ID: "+parsed.id);
        if(parsed.id == "null") // Update this line to null later
        {
           parsed.id = doc.id;
           localStorage.setItem('playerData', JSON.stringify(parsed));
           const saved = localStorage.getItem('playerData');
           let pars = saved ? JSON.parse(saved) : {};
           console.log("Saved Id: "+pars.id);
           console.log('Found document:');
           const docRef = window.firebase.doc(window.firebase.db, 'LeaderBoard', pars.id);
           const docGet = await window.firebase.getDoc(docRef);
           
           if (docGet.exists()) {
            const data = docGet.data();
            console.log('Found document:'+ data);
          } else {
              console.log('No document found with ID:'+ pars.id);
          }
        }
      }

    }
    resetLocalStorage()
    {
      resources.load('PlayerData', JsonAsset, (err, jsonAsset) => {
        if (err) {
            console.error('Failed to load JSON:', err);
            return;
        }
       const local = localStorage.setItem('playerData', JSON.stringify(jsonAsset.json));
      })
    }
    // async getTopScores(count: number = 10) {
    //   const { db, collection, getDocs, query, orderBy, limit } = window.firebase;
    //   const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(count));
    //   const snapshot = await getDocs(q);
    //   return snapshot.docs.map(doc => doc.data());
    // }

    // private static instance: LeaderBoard;
    // onLoad() {
    //   if (LeaderBoard.instance) {
    //     this.destroy();
    //     return;
    //   }
    //   LeaderBoard.instance = this;
  
    //   // Firebase is already loaded from CDN
    //   console.log("Firebase Ready:", firebaseApp.getApp().name);
  
    //   // Example: Anonymous Sign-In
    //   this.signInAnonymously();
    // }
  
    // // Example: Sign in anonymously
    // signInAnonymously() {
      
    //     firebaseApp.auth().signInAnonymously()
    //     .then(() => console.log("Signed in as guest"))
    //     .catch(error => console.error("Auth error:", error));
    // }
  
    // // Example: Save data to Realtime Database
    // saveData(path: string, data: any) {
    //   firebaseDB.Database.database().ref(path).set(data)
    //     .then(() => console.log("Data saved!"))
    //     .catch(error => console.error("Save failed:", error));
    // }
  
    // // Example: Read data
    // async getData(path: string) {
    //   const snapshot = await firebase.database().ref(path).once('value');
    //   return snapshot.val();
    // }
  }
  