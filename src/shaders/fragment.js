export const fragment = /* glsl */ `
    uniform sampler2D uTexture;
    varying float vHeight; 
    varying float vPerlinStrength;
    varying float vTime;
    varying vec2 vMouse;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 eyeVector; 

    void main() {    
        vec2 uv = gl_FragCoord.xy/vec2(1000.0);
        vec3 X = dFdx(vNormal);
        vec3 Y = dFdy(vNormal);
        vec3 normal = normalize(cross(X,Y));

        vec3 refracted = refract(eyeVector, normal, 1.0/3.0);
        uv += refracted.xy;

        float diffuse = dot(normal, vec3(1.0));
        vec4 t = texture2D(uTexture, uv);

        gl_FragColor = t;
    }
`
