class PixelShader extends ShaderProgram {

    constructor() {
        var VERTEX_SOURCE = `#version 300 es
            in vec2 in_position;
            in vec2 in_texture;

            out vec2 o_texture;

            void main() {
                o_texture = in_texture;
                gl_Position = vec4(in_position.xy , 0.0 , 1.0);
            }

        `;

        var FRAGMENT_SOURCE = `#version 300 es
            precision mediump float;

            in vec2 o_texture;

            uniform sampler2D u_sampler;

            out vec4 color;

            uniform float u_factor;

            void main() {

                float sw = 640.0/1024.0;
                float sh = 480.0/1024.0;

                float size_wcell = sw / (640.0 * u_factor);
                float size_hcell = sh / (480.0 * u_factor);

                float ntx = floor(o_texture.x / size_wcell) * size_wcell;
                float nty = floor(o_texture.y / size_hcell) * size_hcell;

                // RGBA
                // color = vec4(o_color.xyz , 1);
                color = texture(u_sampler , vec2(ntx , nty));
            }
        `;

        super(VERTEX_SOURCE , FRAGMENT_SOURCE);

        this.registerLocations();

    }

    registerLocations() {

        this.in_position_loc = this.getAttribLocation("in_position");
        this.in_texture_loc   = this.getAttribLocation("in_texture");
        this.u_sampler_loc   = this.getUniformLocation("u_sampler");
        this.u_factor_loc   = this.getUniformLocation("u_factor");
    }


}