export const fragment = /* glsl */ `
    uniform sampler2D uTexture;
    varying float vHeight; 
    varying float vPerlinStrength;
    varying float vTime;
    varying vec2 vMouse;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 eyeVector; 
    varying vec2 vResolution;

    float hash(float n){return fract(sin(n) * 43758.5453123);}

    void main() {    
        vec3 X = dFdx(vNormal);
        vec3 Y = dFdy(vNormal);
        vec3 normal = normalize(cross(X,Y));
        float diffuse = dot(normal, vec3(1.0));

        float randX = hash(floor(diffuse*5.0));
        float randY = hash(floor(diffuse*5.0));

        vec2 uvv = vec2(
            sign(randX - 0.5) * 1.0 + (randX - 0.5) * 0.5,
            sign(randY - 0.5) * 1.0 + (randY - 0.5) * 0.5
        );

        vec2 uv = uvv*gl_FragCoord.xy/vResolution;

        vec3 refracted = refract(eyeVector, normal, 1.0/3.0);
        uv += 0.5 * refracted.xy;

        float fresnal = pow(1.0 + dot(eyeVector, normal), 5.0); 


        vec4 t = texture2D(uTexture, uv);
        t *= 1.0 - fresnal;

        gl_FragColor = t;
    }
`
