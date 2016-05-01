const vec3 COLOR = vec3(255.0, 0.0, 255.0) /255.;


uniform float iWidth = 0.04;
uniform float iMiddle = 0.5;
uniform float iShell = 1.0;
uniform float iSpeed = 1.0;

vec4 getProceduralColor() {
    float intensity = 0.0;
    float time = iGlobalTime / 5.0 * iSpeed;
    vec3 position = _position.xyz * 1.5 * iWorldScale;
    for (int i = 0; i < 3; ++i) {
        float modifier = pow(2, i);
        vec3 noisePosition = position * modifier;
        float noise = snoise(vec4(noisePosition, time));
        noise /= modifier;
        intensity += noise;
    }

    intensity += 1.0;

    intensity /= 2.0;
    if (intensity > iMiddle + iWidth || intensity < iMiddle - iWidth) {
        discard;
    }
    return vec4(COLOR * iShell, 1);
}


float getProceduralColors(inout vec3 diffuse, inout vec3 specular, inout float shininess) {
    specular = getProceduralColor().rgb * 0.5;
    shininess = 1.0;
    return 1.0;
}
