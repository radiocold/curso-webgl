class ShaderProgram  {

    constructor(vs , fs) {
        this.vs = vs;
        this.fs = fs;

        this.program = null;

        this.createAndCompile();
    }

    createAndCompile() {
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertexShader) {
            console.log("Error crear Vertex Shader");
            return;
        }

        gl.shaderSource(vertexShader, this.vs);
        gl.compileShader(vertexShader);

        var compiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
        if (!compiled) {
            var error = gl.getShaderInfoLog(vertexShader);
            console.log("Error vs : " + error);
            return;
        }

        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fragmentShader) {
            console.log("Error crear Vertex Shader");
            return;
        }

        gl.shaderSource(fragmentShader, this.fs);
        gl.compileShader(fragmentShader);

        var compiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
        if (!compiled) {
            var error = gl.getShaderInfoLog(fragmentShader);
            console.log("Error fs : " + error);
            return;
        }
        
        this.program = gl.createProgram();
        if (!this.program) {
            return;
        }
        
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        var linked = gl.getProgramParameter(this.program, gl.LINK_STATUS);
        if (!linked) {
            var error = gl.getProgramInfoLog(this.program);
            console.log("Error Program : " + error);
            return;
        }

        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        gl.useProgram(this.program);
        
    }

    getAttribLocation(name) {
        var loc = gl.getAttribLocation(this.program, name);
        if (loc < 0) {
            console.log("Error getAttribLocation " + name);
        }
        return loc;
    }

    getUniformLocation(name) {
        var loc = gl.getUniformLocation(this.program, name);
        if (loc < 0) {
            console.log("Error getUniformLocation " + name);
        }
        return loc;
    }

    use() {
        gl.useProgram(this.program);
    }


}