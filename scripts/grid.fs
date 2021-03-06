const vec3 COLOR = vec3(255.0, 0.0, 255.0) /255.;


uniform float iWidth = 0.004;
uniform float iMiddle = 0.5;
uniform float iShell = 1.0;
uniform float iSpeed = 1.0;
uniform float grid = 5;
uniform float iXSpeed = 0.1;
uniform float iYSpeed = 0.3;
uniform float iZSpeed = 0.23;

vec4 getProceduralColor() {
    float intensity = 0.0;    
    float time = (iGlobalTime ) * iSpeed;
    vec3 position = _position.xyz * 1.5 * iWorldScale;
    for (int i = 0; i < 6; ++i) {
        float modifier = pow(2, i);
        vec3 noisePosition = position * modifier;
	noisePosition[2] *= (30+ mod(noisePosition[1], 30));
	noisePosition[1] += time;
	noisePosition[0] += time;
        float noise = snoise(vec4(noisePosition, time));
        noise /= modifier;
        intensity += noise;
    }

    intensity += 1.0;

    intensity /= 3.0;
    if (intensity > iMiddle + iWidth || intensity < iMiddle - iWidth) {
        discard;
    }

    //check if on grid, then check for orientation, so we dont flicker cube faces..
    if ((mod((position[0]+time/100.*(.01+iXSpeed)) *100 *grid, mod(time, 3)+2) < 1)){
	discard;
    }
    if ((mod((position[1]+time/100.*(.01+iYSpeed)) *100 *grid, 5) < 1)){
	discard;
    }
    if ((mod((position[2]+time/100.*(.01+iZSpeed)) *100 *grid, 5) < 1)){
	discard;
    }
          	
    return vec4(COLOR * iShell, .5);
}


float getProceduralColors(inout vec3 diffuse, inout vec3 specular, inout float shininess) {
    specular = getProceduralColor().rgb * 0.5;
    shininess = 1.0;
    return 0.0;
}
