const hsl2rgb = `
    // hsl2rgb written by Matt DesLauriers - https://github.com/Jam3/glsl-hsl2rgb/blob/master/index.glsl
    float hue2rgb(float f1, float f2, float hue) {
        if(hue < 0.0)
            hue += 1.0;
        else if(hue > 1.0)
            hue -= 1.0;
        float res;
        if((6.0 * hue) < 1.0)
            res = f1 + (f2 - f1) * 6.0 * hue;
        else if((2.0 * hue) < 1.0)
            res = f2;
        else if((3.0 * hue) < 2.0)
            res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
        else
            res = f1;
        return res;
    }

    vec3 hsl2rgb(vec3 hsl) {
        vec3 rgb;

        if(hsl.y == 0.0) {
            rgb = vec3(hsl.z); // Luminance
        } else {
            float f2;

            if(hsl.z < 0.5)
                f2 = hsl.z * (1.0 + hsl.y);
            else
                f2 = hsl.z + hsl.y - hsl.y * hsl.z;

            float f1 = 2.0 * hsl.z - f2;

            rgb.r = hue2rgb(f1, f2, hsl.x + (1.0 / 3.0));
            rgb.g = hue2rgb(f1, f2, hsl.x);
            rgb.b = hue2rgb(f1, f2, hsl.x - (1.0 / 3.0));
        }
        return rgb;
    }

    vec3 hsl2rgb(float h, float s, float l) {
        return hsl2rgb(vec3(h, s, l));
    }
`

export const fragment = /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vBary;
    varying vec2 vUv; 
    ${hsl2rgb}
    

    void main() {
        float width = 2.0;
        vec3 d = fwidth(vBary);
        vec3 s = smoothstep(d*(width + 0.5), d*(width - 0.5), vBary);
        float line = max(s.x, max(s.y, s.z));

        vec3 X = dFdx(vNormal);
        vec3 Y = dFdy(vNormal);
        vec3 normal = normalize(cross(X, Y));    
        float diffuse = dot(normal, vec3(1.0));

        if(line > 0.2) discard;
        gl_FragColor = vec4(vec3(diffuse), 1.0);
    }
`
