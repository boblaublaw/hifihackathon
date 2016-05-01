//  Script to spawn phonebooth object
//
//  By Joe Boyle 
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

// references to our assets.  entity scripts need to be served from somewhere that is publically accessible -- so http(s) or atp


var BOOTH_SCRIPT_URL =  "http://rawgit.com/boblaublaw/hifihackathon/master/scripts/booth.js";
var GAMESTATE_SCRIPT_URL = "https://raw.githubusercontent.com/boblaublaw/hifihackathon/master/scripts/gameState.js"
var MODEL_URL =         "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/phoneBooth.fbx";
var BLOCKSPAWNER_SCRIPT_URL = "https://raw.githubusercontent.com/boblaublaw/hifihackathon/master/scripts/blockSpawner.js"

print("SPAWNBOOTH START");

var numBooths = 5;
var numThings = 0;
var startTimeInSeconds = new Date().getTime() / 1000;

var lifeTime = 3600; // One hour lifespan
var frame = 0;

// Array of Booths
var Booths = [];
var allThings = [];
var roomCollisionList = "myAvatar,otherAvatar";

function addRoom() {
  print ('SPAWNBOOTH adding room elements joe');
  // this is a list of property dictionaries which i will iterate over in a second:
  var propertyList = [{
    type: "Box",
    name: "floor",
    position: { x: 0, y: -1.2, z:0 },
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
    script: GAMESTATE_SCRIPT_URL
  },{
    type: "Box",
    name: "blockSpawner",
    position: {
		x: -2,
		y: 0,
		z:1
    },
    dimensions: {
      x: 0.3,
      y: 0.3,
      z: 0.3
    },
    collidesWith: roomCollisionList,
    dynamic: false,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime,
    visible:true,
    shapeType: "box",
    script: BLOCKSPAWNER_SCRIPT_URL
  },{
    type: "Box",
    name: "gameState",
    position: { x: 0, y: 0, z:0 },
    dimensions: {
      x: 10,
      y: 0.1,
      z: 10
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
    shapeType: "box"
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
  var boxProperties = {
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
  var box = Entities.addEntity(boxProperties);

  var boothProperties = {
    type: "Model",
    modelURL: MODEL_URL,
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
    parentId: box,
    gravity: {
      x: 0,
      y: 0,
      z: 0
    },
    lifetime: lifeTime
  };
  var booth = Entities.addEntity(boothProperties);

  print("SPAWNBOOTH: adding a booth " + booth + " & box " + box + "!");
  Booths.push(box);
  allThings.push(booth);
  allThings.push(box);
  numThings += 2;
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