class ColorShader extends ShaderProgram {

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

            void main() {
                // RGBA
                // color = vec4(o_color.xyz , 1);
                color = texture(u_sampler , o_texture);
                color = vec4(1.0 - color.x , 1.0 - color.y , 1.0 - color.z  , 1.0);

            }
        `;

        super(VERTEX_SOURCE , FRAGMENT_SOURCE);

        this.registerLocations();

    }

    registerLocations() {

        this.in_position_loc = this.getAttribLocation("in_position");
        this.in_texture_loc   = this.getAttribLocation("in_texture");
        this.u_sampler_loc   = this.getUniformLocation("u_sampler");
    }


}