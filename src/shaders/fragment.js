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
    varying float vHeight; 
    varying float vPerlinStrength;
    varying vec2 vUv;
    varying float vTime;

    ${hsl2rgb}

    void main() {
        float temp = sin(vPerlinStrength * 4.0) * 0.5 + 0.5;
        // temp = temp * (vUv.y * vUv.x) + 0.2;
        // float xPos = sin(vTime * 0.8) * 0.5 + 0.5;
        // float yPos = cos(vTime * 0.8) * 0.5 + 0.5;
        temp = temp * distance(vUv, vec2(0.2, 0.8)) + 0.15;

        temp = temp * 0.5 + 0.5;
        vec3 color = hsl2rgb(temp, 0.5, 0.5);
    
        gl_FragColor = vec4(color, 1.0);
    }
`
