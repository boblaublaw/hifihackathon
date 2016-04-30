//  changeColorOnClickDown.js
(function(){ 
    var clicked = false;
    this.clickDownOnEntity = function(entityID, mouseEvent) { 

	    var blob = {"ProceduralEntity":{"version":2,"shaderUrl":"c:/Users/colin/Desktop/hifihackathon/scripts/quora.fs","uniforms":{"iSpeed":3,"iShell":1,"iWidth":0.04}}};
	    var blob2 = {"ProceduralEntity":{"version":2,"shaderUrl":"c:/Users/colin/Desktop/hifihackathon/scripts/quora.fs","uniforms":{"iSpeed":3,"iShell":1,"iWidth":0.1}}};

	if (clicked){
	    
            Entities.editEntity(entityID, { userData: (JSON.stringify(blob)) });
	    Entities.editEntity(entityID, { color: { red: 0, green: 0 , blue: 0} });
            clicked = false;
        }else{
            Entities.editEntity(entityID, { userData: (JSON.stringify(blob2)) });
            Entities.editEntity(entityID, { color: { red: 255, green: 255, blue: 255} });
            clicked = true; 
        }
    }; 
})

