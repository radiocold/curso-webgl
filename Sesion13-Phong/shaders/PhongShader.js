class PhongShader extends ShaderProgram {

    constructor() {
        var VERTEX_SOURCE = `#version 300 es
            in vec3 in_position;
            in vec2 in_texture;
            in vec3 in_normal;

            out vec2 o_texture;

            uniform mat4 u_proj;
            uniform mat4 u_view;
            uniform mat4 u_model;

            out vec3 vertex_position_world;
            out vec3 normal_world;

            void main() {

                vertex_position_world  = vec3(u_model * vec4(in_position , 1.0));

                normal_world = vec3(u_model * vec4(in_normal , 0.0));
                normal_world = normalize(normal_world);

                o_texture = in_texture;
                gl_Position = u_proj * u_view * u_model * vec4(in_position, 1);
            }

        `;

        var FRAGMENT_SOURCE = `#version 300 es
            precision mediump float;
            in vec2 o_texture;

            in vec3 vertex_position_world;
            in vec3 normal_world;

            vec3 light_position_world = vec3(0.0 , 5.0 , 5.0);
            vec3 Ls = vec3(1.0 , 1.0 , 1.0 );
            vec3 Ld = vec3(0.7 , 0.7 , 0.7 );
            vec3 La = vec3(0.2 , 0.2 , 0.2 );

            vec3 Ks = vec3(0.0 , 0.0 , 0.0 );
            vec3 Kd = vec3(0.0 , 1.0 , 0.0 );
            vec3 Ka = vec3(1.0 , 1.0 , 1.0 );

            float specular_exponent = 20.0;

            out vec4 color;

            uniform sampler2D u_sampler;

            uniform vec3 u_camera_pos_world;

            void main() {

                vec3 Ia = La * Ka;


                vec3 distance_to_light = light_position_world - vertex_position_world;
                distance_to_light = normalize(distance_to_light);

                float dot_prod = dot(distance_to_light , normal_world);
                dot_prod = max(dot_prod , 0.0);

                vec3 Id = Ld * Kd * dot_prod;

                vec3 surface_to_viewer = u_camera_pos_world - vertex_position_world;
                surface_to_viewer = normalize(surface_to_viewer);

                vec3 reflection = -distance_to_light + 2.0 * normal_world * dot(normal_world , distance_to_light);
                float dot_prod_specular = dot (reflection , surface_to_viewer);
                dot_prod_specular = max(dot_prod_specular , 0.0);
                dot_prod_specular = pow(dot_prod_specular , specular_exponent);

                vec3 Is = Ls * Ks * dot_prod_specular;

                vec3 I = Ia + Id + Is;

                // RGBA
                // color = vec4(o_color.xyz , 1);
                color = texture(u_sampler , o_texture) * vec4(I , 1.0);
            }
        `;

        super(VERTEX_SOURCE , FRAGMENT_SOURCE);

        this.registerLocations();

    }

    registerLocations() {

        this.in_position_loc = this.getAttribLocation("in_position");
        this.in_normal_loc   = this.getAttribLocation("in_normal");
        this.in_texture_loc   = this.getAttribLocation("in_texture");
        
        this.u_model_loc   = this.getUniformLocation("u_model");
        this.u_view_loc   = this.getUniformLocation("u_view");
        this.u_proj_loc   = this.getUniformLocation("u_proj");
        this.u_sampler_loc   = this.getUniformLocation("u_sampler");
        this.u_camera_pos_world_loc   = this.getUniformLocation("u_camera_pos_world");
    }


}