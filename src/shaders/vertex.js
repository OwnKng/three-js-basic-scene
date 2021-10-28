export const vertex = /* glsl */ `
    uniform float uSize;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uDistortionFrequency;
    uniform float uDistortionStrength;
    uniform float uDisplacementFrequency;
    uniform float uDisplacementStrength;
    uniform vec2 uResolution;


    attribute float aScale;
    attribute vec3 aBary; 
    varying vec3 vBary;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 eyeVector; 
    varying vec2 vResolution;

    #define PI 3.14159265359

    void main() {

        //_ position
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;

        eyeVector = normalize(modelPosition.xyz - cameraPosition);
        
        //_ 
        vUv = uv;
        vNormal = normalize(mat3(modelMatrix) * normal);
        vResolution = uResolution;
        vBary = aBary;
  
    }
`
