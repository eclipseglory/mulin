
const VERTEXT_SOURCE =
    "    attribute vec2 position;\n" +
    "    attribute vec2 t_position;\n" +
    "    varying vec2 texture_position;\n" +
    "    uniform mat4 perspective_matrix;\n" +
    "    void main() {\n" +
    "        // 因为给的是一个2个数字的坐标，这里把坐标数据补全\n" +
    "        vec4 new_position = vec4(position.x, position.y, 0, 1);\n" +
    "        // 用二维的正投矩阵得到最终的坐标位置\n" +
    "        vec4 final_position = perspective_matrix * new_position;\n" +
    "        // 带入插值\n" +
    "        texture_position = t_position;\n" +
    "        gl_Position = final_position;\n" +
    "    }";

const FRAGMENT_SOURCE =
    "precision mediump float;\n" +
    "varying vec2 texture_position;\n" +
    "uniform sampler2D u_texture;\n" +
    "void main(){\n" +
    "    vec4 color = texture2D(u_texture,texture_position);\n" +
    "    gl_FragColor = color;\n" +
    "}";


/**
 * 等到有了真正的offscreencanvas再说
 * @deprecated
 */
export default class WebglProgram {
    constructor() {
        let temp = wx.createOffscreenCanvas();
        this.gl = temp.getContext('webgl');
        if (gl == null) throw new Error('很抱歉，设备不支持WebGL');
    }

    init() {
        let gl = this.gl;
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        // gl.enable(gl.DEPTH_TEST);
        // gl.depthFunc(gl.LEQUAL);
        this.shaderInfomations = this._initShaderProgram(gl);
    }

    _initShaderProgram(gl) {
        gl = gl || this.gl;
        let program = gl.createProgram();
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, VERTEXT_SOURCE);
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, FRAGMENT_SOURCE);

        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            gl.deleteShader(vertexShader);
            throw new Error('顶点作色器编译错误');
        }
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            gl.deleteShader(fragmentShader);
            throw new Error('片段作色器编译错误');
        }
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.deleteProgram(program);
            throw new Error('无法初始化Program: ' + gl.getProgramInfoLog(program));
        }
        gl.useProgram(program);

        // 开始设置shader的变量属性

        // 顶点坐标
        let vertexPositiondAttribute = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(vertexPositiondAttribute);

        // 顶点对应texture坐标
        let textureCoordAttribute = gl.getAttribLocation(program, "t_position");
        gl.enableVertexAttribArray(textureCoordAttribute);

        // 转换矩阵全局变量
        let perspectiveMatrix = gl.getUniformLocation(program, "perspective_matrix");

        // 创建Buffer
        let verticesBuffer = gl.createBuffer();
        return {
            program: program,
            vertexPositiondAttribute: vertexPositiondAttribute,
            textureCoordAttribute: textureCoordAttribute,
            perspectiveMatrix: perspectiveMatrix,
            verticesBuffer: verticesBuffer
        };
    }
}
/** 为方便，把shader写到注释里. Vertext Shader
    attribute vec2 position;
    attribute vec2 t_position;
    varying vec2 texture_position;
    uniform mat4 perspective_matrix;
    void main() {
        // 因为给的是一个2个数字的坐标，这里把坐标数据补全
        vec4 new_position = vec4(position.x, position.y, 0, 1);
        // 用二维的正投矩阵得到最终的坐标位置
        vec4 final_position = perspective_matrix * new_position;
        // 带入插值
        texture_position = t_position;
        gl_Position = final_position;
    }
 */
/**
precision mediump float;//中精度即可
varying vec2 texture_position;
uniform sampler2D u_texture;
void main(){
    vec4 color = texture2D(u_texture,texture_position);
    gl_FragColor = color;
}
 */