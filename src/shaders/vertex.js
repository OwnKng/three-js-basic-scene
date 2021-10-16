export const vertex = /* glsl */ `
    uniform float uSize;
    varying float vDistortion; 
    void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);

        float distortion = sin(modelPosition.x * 2.0) * sin(modelPosition.z * 4.0) * 0.1; 
        modelPosition.y = modelPosition.y + distortion;

        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;

        gl_Position = projectedPosition;
        gl_PointSize = uSize;

        vDistortion = distortion;
    }
`
