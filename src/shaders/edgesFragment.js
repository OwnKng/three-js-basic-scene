export const edgesFragment = /*glsl*/ `
    varying vec3 vBary;

    void main() {
        float width = 2.0;
        vec3 d = fwidth(vBary);
        vec3 s = smoothstep(d*(width + 0.5), d*(width-0.5),vBary);
        float line = max(s.x, max(s.y, s.z));

        if(line < 0.1) discard;
        gl_FragColor = vec4(mix(vec3(1.0), vec3(0.0), 1.0 - line), 1.0);
    }
`
