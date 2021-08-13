class MainShader extends ShaderProgram {

    constructor() {
        var VERTEX_SOURCE = `#version 300 es
            in vec3 in_position;
            in vec3 in_color;
            in vec2 in_texture;

            out vec2 o_texture;

            uniform mat4 u_proj;
            uniform mat4 u_view;
            uniform mat4 u_model;

            out vec3 o_color;

            void main() {
                o_color = in_color;
                o_texture = in_texture;
                gl_Position = u_proj * u_view * u_model * vec4(in_position, 1);
            }

        `;

        var FRAGMENT_SOURCE = `#version 300 es
            precision mediump float;

            in vec3 o_color;
            in vec2 o_texture;

            out vec4 color;

            uniform sampler2D u_sampler;

            void main() {
                // RGBA
                // color = vec4(o_color.xyz , 1);
                color = texture(u_sampler , o_texture);
            }
        `;

        super(VERTEX_SOURCE , FRAGMENT_SOURCE);

        this.registerLocations();

    }

    registerLocations() {

        this.in_position_loc = this.getAttribLocation("in_position");
        this.in_color_loc   = this.getAttribLocation("in_color");
        this.in_texture_loc   = this.getAttribLocation("in_texture");
        
        this.u_model_loc   = this.getUniformLocation("u_model");
        this.u_view_loc   = this.getUniformLocation("u_view");
        this.u_proj_loc   = this.getUniformLocation("u_proj");
        this.u_sampler_loc   = this.getUniformLocation("u_sampler");
    }


}