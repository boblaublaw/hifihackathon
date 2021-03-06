//  Script to spawn phonebooth object
//
//  By Joe Boyle 
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

// references to our assets.  entity scripts need to be served from somewhere that is publically accessible -- so http(s) or atp


var BOOTH_SCRIPT_URL =        "http://rawgit.com/boblaublaw/hifihackathon/master/scripts/booth.js";
var GAMESTATE_SCRIPT_URL =    "http://rawgit.com/boblaublaw/hifihackathon/master/scripts/gameState.js"
var PHONEBOOTH_MODEL_URL =    "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/phoneBooth.fbx";
var HANDSET_MODEL_URL =       "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/handset.fbx";
var BLOCKSPAWNER_SCRIPT_URL = "http://rawgit.com/boblaublaw/hifihackathon/master/scripts/blockSpawner.js";

var CYBERFLOOR_URL =          "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/cyberFloor7.fbx";

var CEILING_URL =             "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/ceiling.fbx";
var FLOOR_URL =               "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/floor.fbx";
var FRONTWALL_URL =           "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/frontWall.fbx";
var REARWALL_URL =            "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/rearWall.fbx";
var LEFTWALL_URL =            "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/ceiling.fbx";
var RIGHTWALL_URL =           "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/rightWall.fbx";

var GARBAGE_CAN_URL =         "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/garbageCan.fbx";
var PILLAR_A_URL =            "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/pillarA.fbx";
var PILLAR_B_URL =            "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/pillarB.fbx";
var PILLAR_C_URL =            "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/pillarC.fbx";

print("SPAWNBOOTH START");

var numBooths = 5;
var numThings = 0;
var startTimeInSeconds = new Date().getTime() / 1000;

var lifeTime = 3600; // One hour lifespan
var frame = 0;

// Array of Booths
var Booths = [];
var allThings = [];
var roomCollisionList = "static,dynamic,otherAvatar,myAvatar";

function addRoom() {
  print ('SPAWNBOOTH adding room elements');

  // this is a list of property dictionaries which i will iterate over in a second:
  var propertyList = [{
    type: "Model",
    modelURL: CYBERFLOOR_URL,
    name: "cyberfloor",
    position: {
      x: 0,
      y: -1.21,
      z:0
    },
    color: {
      red: 0,
      green: 0,
      blue: 255
    },
    dimensions: {
      x: 10,
      y: 0.01,
      z: 10
    },
    collidesWith: roomCollisionList,
    dynamic: false,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime,
    shapeType: "box",
  },{
    type: "Box",
    color: {
      red: 16,
      green: 16,
      blue: 16
    },
    name: "cyberfloorBacking",
    position: {
      x: 0,
      y: -1.23,
      z:0
    },
    color: {
      red: 0,
      green: 0,
      blue: 255
    },
    dimensions: {
      x: 10,
      y: 0.01,
      z: 10
    },
    collidesWith: "",
    dynamic: false,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime,
    shapeType: "box",
  },{
    type: "Box",
    //modelURL: FLOOR_URL,
    name: "floor",
    position: {
      x: 0,
      y: -1.2,
      z:0
    },
    dimensions: {
      x: 10,
      y: 0.1,
      z: 10
    },
    collidesWith: roomCollisionList,
    dynamic: false,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime,
    shapeType: "box",
  },{
    type: "Model",
    modelURL: HANDSET_MODEL_URL,
    name: "blockSpawner",
    position: {
      x: -2.3346,
      y: 0.2532,
      z: -4.1333
    },
    dimensions: {
      x: 0.0715,
      y: 0.2772,
      z: 0.0696
    },
    collidesWith: roomCollisionList,
    dynamic: true,
    gravity: {
      x: 0,
      y: -9.8,
      z: 0
    },
    lifetime: lifeTime,
    visible:true,
    shapeType: "box",
    script: BLOCKSPAWNER_SCRIPT_URL,
    userData: JSON.stringify({
      grabbableKey: {
        grabbable: true
      }
    })
  },{
    type: "Box",
    name: "gameState",
    position: { x: 0, y: 0, z:-7 },
    dimensions: {
      x: 1,
      y: 1,
      z: 1
    },
    visible:false,
    collidesWith: "",
    dynamic: false,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime,
    shapeType: "box",
    script: GAMESTATE_SCRIPT_URL
  },{
    type: "Model",
    modelURL: GARBAGE_CAN_URL,
    name: "garbageCan",
    position: {
      x: 4.1392,
      y: -0.6824,
      z:-3.8185
    },
    dimensions: {
      x: 0.6711,
      y: 1.0791,
      z: 0.7145
    },
    collidesWith: roomCollisionList,
    dynamic: false,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime,
    shapeType: "box",
  },{
    type: "Model",
    modelURL: PILLAR_A_URL,
    name: "pillarA",
    position: {
      x: 2.8223,
      y: 0.1073,
      z: 2.9537
    },
    dimensions: {
      x: 1.0489,
      y: 2.6406,
      z: 1.1836
    },
    collidesWith: roomCollisionList,
    dynamic: false,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime,
    shapeType: "box",
  },{
    type: "Model",
    modelURL: PILLAR_B_URL,
    name: "pillarB",
    position: {
      x: -1.7620,
      y: 0.1073,
      z: 2.9537
    },
    dimensions: {
      x: 1.0489,
      y: 2.6406,
      z: 1.1836
    },
    collidesWith: roomCollisionList,
    dynamic: false,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime,
    shapeType: "box",
  },{
    type: "Box",
    name: "ceiling",
    position: { x: 0, y: 1.5, z:0 },
    dimensions: {
      x: 10,
      y: 0.1,
      z: 10
    },
    collidesWith: "",
    dynamic: false,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime,
    shapeType: "box"
  },{
    type: "Box",
    name: "rightwall",
    position: { x: 5.0, y: 0, z:0 },
    dimensions: {
      x: 0.1,
      y: 3,
      z: 10
    },
    collidesWith: roomCollisionList,
    dynamic: false,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime,
    shapeType: "box"
  }, {
    type: "Model",
    modelURL: REARWALL_URL,
    name: "gamewall",
    position: { x: 0, y: 0, z:4.9 },
    dimensions: {
      x: 10,
      y: 3,
      z: 0.1
    },
    collidesWith: roomCollisionList,
    dynamic: false,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime,
    shapeType: "box"
  },{
    type: "Box",
    name: "farwall",
    position: { x: 0, y: 0, z:-4.7 },
    dimensions: {
      x: 10,
      y: 3,
      z: 0.1
    },
    collidesWith: roomCollisionList,
    dynamic: false,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime,
    shapeType: "box"
  }, {
    type: "Box",
    name: "leftwall",
    position: { x: -5, y: 0, z:0 },
    dimensions: {
      x: 0.1,
      y: 3,
      z: 10
    },
    collidesWith: roomCollisionList,
    dynamic: false,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime,
    shapeType: "box"
  }];

  for (var i = 0; i < propertyList.length; i++) {
    var properties = propertyList[i];
    var thing = Entities.addEntity(properties);
    print ("added " + properties['name']);
    allThings.push(thing);
    numThings += 1;
  }
}

function addBooth(i) {
/*  var boxProperties = {
    type: "Box",
    name: "phoneBox" + i,
    position: { x: i-2.5, y: 0, z:-4 },
    dimensions: {
      x: 1.0,
      y: 2.3,
      z: 1.4
    },
    collidesWith: "",
    dynamic: false,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    visible: false,
    lifetime: lifeTime,
    shapeType: "box",
    script: BOOTH_SCRIPT_URL
  };
  var box = Entities.addEntity(boxProperties);*/

  var boothProperties = {
    type: "Model",
    modelURL: PHONEBOOTH_MODEL_URL,
    shapeType: "box",
    name: "phoneBoothModel" + i,
    position: { x: i-2.5, y: 0, z:-4 },
    dimensions: {
      x: 1.0272,
      y: 2.3678,
      z: 1.4398
    },
    visible: true,
    collidesWith: "",
    dynamic: false,
    //parentID: box,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime
  };
  var booth = Entities.addEntity(boothProperties);

  // we only add handsets for the other 4 booths:
  if (i != 0) {
    print("SPAWNBOOTH: adding a handset for booth #" + i + "!");
    var handsetProperties = {
      type: "Model",
      modelURL: HANDSET_MODEL_URL,
      shapeType: "box",
      name: "handsetModel" + i,
      position: {
        x: i - 2.3346,
        y: 0.2532,
        z: -4.1333
      },
      dimensions: {
        x: 0.0715,
        y: 0.2772,
        z: 0.0696
      },
      visible: true,
      collidesWith: roomCollisionList,
      dynamic: true,
      //parentId: box,
      gravity: {
        x: 0,
        y: -9.8,
        z: 0
      },
      lifetime: lifeTime,
      userData: JSON.stringify({
        grabbableKey: {
          grabbable: true
        }
      })
    };
    var handset = Entities.addEntity(handsetProperties);
    allThings.push(handset);
    numThings += 1;
  }

  print("SPAWNBOOTH: adding a booth #" + i + "!");
  //Booths.push(box);
  allThings.push(booth);

  //allThings.push(box);
  numThings += 1;
}


addRoom();

// Generate the Booths
for (var i = 0; i < numBooths; i++) {
  addBooth(i);
}

// Main update function
function updateBooths(deltaTime) {  
  frame++;
  // Only update every third frame because we don't need to do it too quickly
  if ((frame % 300) == 0) {
    // Update all the Booths
/*    print ('this is the update check!');
    for (var i = 0; i < numBooths; i++) {
      print (Booths[i].occupant + " is in me");
    }*/
  }
  // Check to see if we've been running long enough that our Booths are dead
  var nowTimeInSeconds = new Date().getTime() / 1000;
  if ((nowTimeInSeconds - startTimeInSeconds) >= lifeTime) {
    Script.stop();
    return;
  }
}

// register the call back so it fires before each data send
Script.update.connect(updateBooths);

//  Delete our little friends if script is stopped
Script.scriptEnding.connect(function() {
    for (var i = 0; i < numThings; i++) {
        Entities.deleteEntity(allThings[i]);
    }
});

print("SPAWNBOOTH END");