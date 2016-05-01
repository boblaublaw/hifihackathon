//  changeColorOnClickDown.js
(function(){

    var _this;
    var clicked = false;
    var blob = {"ProceduralEntity":{"version":2,"shaderUrl":"https://raw.githubusercontent.com/boblaublaw/hifihackathon/master/scripts/grid.fs","uniforms":{"iSpeed":1,"iShell":10,"iWidth":0.04,"grid":2,"iZSpeed":4}}};

    CyberFloor = function() {
	_this = this;
    };

    CyberFloor.prototype = {

	preload : function(entityID) {
	    _this.entityID = entityID;
            Entities.editEntity(entityID, { userData: (JSON.stringify(blob)) });
	    Entities.editEntity(entityID, { color: { red: 0, green: 255 , blue: 255} });
	}

    };
    return new CyberFloor();
});
