//  changeColorOnClickDown.js
(function(){ 
    var clicked = false;
    this.clickDownOnEntity = function(entityID, mouseEvent) { 

	var blob = {"ProceduralEntity":{"version":2,"shaderUrl":"https://raw.githubusercontent.com/boblaublaw/hifihackathon/master/scripts/grid.fs","uniforms":{"iSpeed":1,"iShell":10,"iWidth":0.081,"grid":7}}};
	    var blob2 = {"ProceduralEntity":{"version":2,"https://raw.githubusercontent.com/boblaublaw/hifihackathon/master/scripts/grid.fs","uniforms":{"iSpeed":1,"iShell":1,"iWidth":0.082}}};

	if (clicked){
	    
            Entities.editEntity(entityID, { userData: (JSON.stringify(blob)) });
	    Entities.editEntity(entityID, { color: { red: 0, green: 250 , blue: 250} });
            clicked = false;
        }else{
            Entities.editEntity(entityID, { userData: (JSON.stringify(blob2)) });
            Entities.editEntity(entityID, { color: { red: 255, green: 255, blue: 255} });
            clicked = true; 
        }
    }; 
})
