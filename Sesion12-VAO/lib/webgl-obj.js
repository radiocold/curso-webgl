// https://webglfundamentals.org/webgl/lessons/webgl-load-obj.html#toc
// This is not a full .obj parser.
// see http://paulbourke.net/dataformats/obj/

function parseOBJ(text) {
    // because indices are base 1 let's just fill in the 0th data
    const objPositions = [[0, 0, 0]];
    const objTexcoords = [[0, 0]];
    const objNormals = [[0, 0, 0]];
    const objColors = [[0, 0, 0]];
  
    // same order as `f` indices
    const objVertexData = [
      objPositions,
      objTexcoords,
      objNormals,
      objColors,
    ];
  
    // same order as `f` indices
    let webglVertexData = [
      [],   // positions
      [],   // texcoords
      [],   // normals
      [],   // colors
    ];
  
    const materialLibs = [];
    const geometries = [];
    let geometry;
    let groups = ['default'];
    let material = 'default';
    let object = 'default';
  
    const noop = () => {};
  
    function newGeometry() {
      // If there is an existing geometry and it's
      // not empty then start a new one.
      if (geometry && geometry.data.position.length) {
        geometry = undefined;
      }
    }
  
    function setGeometry() {
      if (!geometry) {
        const position = [];
        const texcoord = [];
        const normal = [];
        const color = [];
        webglVertexData = [
          position,
          texcoord,
          normal,
          color,
        ];
        geometry = {
          object,
          groups,
          material,
          data: {
            position,
            texcoord,
            normal,
            color,
          },
        };
        geometries.push(geometry);
      }
    }
  
    function addVertex(vert) {
      const ptn = vert.split('/');
      ptn.forEach((objIndexStr, i) => {
        if (!objIndexStr) {
          return;
        }
        const objIndex = parseInt(objIndexStr);
        const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
        webglVertexData[i].push(...objVertexData[i][index]);
        // if this is the position index (index 0) and we parsed
        // vertex colors then copy the vertex colors to the webgl vertex color data
        if (i === 0 && objColors.length > 1) {
          geometry.data.color.push(...objColors[index]);
        }
      });
    }
  
    const keywords = {
      v(parts) {
        // if there are more than 3 values here they are vertex colors
        if (parts.length > 3) {
          objPositions.push(parts.slice(0, 3).map(parseFloat));
          objColors.push(parts.slice(3).map(parseFloat));
        } else {
          objPositions.push(parts.map(parseFloat));
        }
      },
      vn(parts) {
        objNormals.push(parts.map(parseFloat));
      },
      vt(parts) {
        // should check for missing v and extra w?
        objTexcoords.push(parts.slice(0, 2).map(parseFloat));
      },
      f(parts) {
        setGeometry();
        const numTriangles = parts.length - 2;
        for (let tri = 0; tri < numTriangles; ++tri) {
          addVertex(parts[0]);
          addVertex(parts[tri + 1]);
          addVertex(parts[tri + 2]);
        }
      },
      s: noop,    // smoothing group
      mtllib(parts, unparsedArgs) {
        // the spec says there can be multiple filenames here
        // but many exist with spaces in a single filename
        materialLibs.push(unparsedArgs);
      },
      usemtl(parts, unparsedArgs) {
        material = unparsedArgs;
        newGeometry();
      },
      g(parts) {
        groups = parts;
        newGeometry();
      },
      o(parts, unparsedArgs) {
        object = unparsedArgs;
        newGeometry();
      },
    };
  
    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
      const line = lines[lineNo].trim();
      if (line === '' || line.startsWith('#')) {
        continue;
      }
      const m = keywordRE.exec(line);
      if (!m) {
        continue;
      }
      const [, keyword, unparsedArgs] = m;
      const parts = line.split(/\s+/).slice(1);
      const handler = keywords[keyword];
      if (!handler) {
        console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
        continue;
      }
      handler(parts, unparsedArgs);
    }
  
    // remove any arrays that have no entries.
    for (const geometry of geometries) {
      geometry.data = Object.fromEntries(
          Object.entries(geometry.data).filter(([, array]) => array.length > 0));
    }
  
    return {
      geometries,
      materialLibs,
    };
}

  
async function parselibs(folder , materialLibs) {

    for (var l in materialLibs) {
        const response_lib = await fetch(folder + '/luigi/' + materialLibs[l]);
        const text = await response_lib.text();
        console.log(text);
    }
    
};
/*@Autor : Martin Melendez Blas
  @ permite parsear el texto de lib*/
function parseLib(textLib) {


    var material = null;
    var materials = [];

    function setMaterial(parts) {
        material = {
            Kd:[0, 0 , 0],
            Ka:[0, 0, 0],
            Ks:[0, 0, 0],
            Ke:[0, 0, 0],
            Ni:0,
            Ns:0,
            d:0,
            illum:1.0,
            map_Kd:""
        };    
        
        materials[parts[0]] = material;
    }

    const keywords = {
        Kd(parts) {
            material.Kd = parts.map(parseFloat);
        },
        Ka(parts) {
          material.Ka = parts.map(parseFloat);
        },
        Ks(parts) {
          material.Ks = parts.map(parseFloat);
        },
        Ke(parts) {
          material.Ke = parts.map(parseFloat);
        },
        Ns(parts) {
          material.Ns = parseFloat(parts[0]);
        },
        Ni(parts) {
          material.Ni = parseFloat(parts[0]);
        },
        d(parts) {
          material.d = parseFloat(parts[0]);
        },
        illum(parts) {
            material.illum = parts[0];
        },
        map_Kd(parts) {
            material.map_Kd = parts[0] + "";
        },
        newmtl(parts) {
          setMaterial(parts);
          
        }

      };


    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = textLib.split('\n');
    
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
      const line = lines[lineNo].trim();
      if (line === '' || line.startsWith('#')) {
        continue;
      }
      const m = keywordRE.exec(line);
      if (!m) {
        continue;
      }
      const [, keyword2, unparsedArgs] = m;
      const parts = line.split(/\s+/).slice(1);
      const handler = keywords[keyword2];
      if (!handler) {
        console.warn('unhandled keyword:', keyword2);  // eslint-disable-line no-console
        continue;
      }
      handler(parts, unparsedArgs);
    }

    return materials;
};

/**
 * Funciones de utilidad para cargar materiales(texturas) y VBOS
 */

async function createTextures(folder , obj , flipY) {
  if (flipY == undefined) {
    flipY = false;
  }
  // Cargar materiales mtl
  var materials = [];
  for (var l in obj.materialLibs) {
      const response_lib = await fetch(folder + "/" + obj.materialLibs[l]);
      const text = await response_lib.text();
      const objLib = parseLib(text);
      materials.push(objLib);
  }

  // Cargar Texturas y colocarlos en el objeto Mesh
  textures = [];
  for (var m in materials) {
      var material = materials[m];
      for (var l in material) {
          var mat = material[l];
          var texture = null;
          try {
              texture = await loadTexture(folder + "/" + mat.map_Kd , flipY);
          } catch (e) {
              console.error(e);
          }
          textures[l] = {texture : texture};
      }
  }

  return textures;
}

function createVBOs(obj) {

  vbos_position = [];
  vbos_texcoord = [];
  materials = [];
  count_vertices = [];

  if (obj.geometries) {

      for (var g = 0; g < obj.geometries.length; g++) {

          // Crear VBO position
          var geometry = obj.geometries[g];
          var vbo_position = gl.createBuffer();
          if (!vbo_position) {
              console.log("Error al crear vbo position");
              return;
          }

          var positions = new Float32Array(geometry.data.position);
          
          gl.bindBuffer(gl.ARRAY_BUFFER, vbo_position);
          gl.bufferData(gl.ARRAY_BUFFER , positions , gl.STATIC_DRAW);

          vbos_position.push(vbo_position);

          // Crear VBO texture
          var texture_coord = geometry.data.texcoord[g];
          var vbo_texture = gl.createBuffer();
          if (!vbo_texture) {
              console.log("Error al crear vbo texture");
              return;
          }
          var texcoords = null;
          // Se valida si la cantidad de coordenadas de textura son solo 2 valores por vertice
          // asumiendo que cada vertice tiene 3 valores
          if ((geometry.data.position.length / 3) * 2 == geometry.data.texcoord.length) {
              texcoords = new Float32Array(geometry.data.texcoord);
          // Significa que las coordendas de textura son 3 valores flotantes , pero los shader solo soporta para 2 valores es por 
          // eso que se toma solo los 2 valores
          } else if (geometry.data.texcoord.length == geometry.data.position.length) {
              var size = geometry.data.texcoord.length;
              var newtexcorrd = [];
              for (var t = 0; t < size; t += 3) {
                  newtexcorrd.push(geometry.data.texcoord[t]);
                  newtexcorrd.push(geometry.data.texcoord[t+1]);
              }
              texcoords = new Float32Array(newtexcorrd);
          }

          if (texcoords == null) {
            console.log("Error en cargar las coordenadas de textura , revisar que tenga 2 o 3 valores por vertice");
            return;
          }
          gl.bindBuffer(gl.ARRAY_BUFFER, vbo_texture);
          gl.bufferData(gl.ARRAY_BUFFER , texcoords , gl.STATIC_DRAW);

          vbos_texcoord.push(vbo_texture);

          // asignar el material y cantidad de vertices
          materials.push(geometry.material);
          count_vertices.push(geometry.data.position.length);
      }
  }

  return {vbos_position , vbos_texcoord , materials , count_vertices};
}

async function loadTexture(src , flipY) {
  var img = await addImageProcess(src);
  var texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D , texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
  // gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D , null);

  return texture;
}

function flipYTexture(texture , flipY) {
  gl.bindTexture(gl.TEXTURE_2D , texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
  gl.bindTexture(gl.TEXTURE_2D , null);
}

function addImageProcess(src){
  return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
  });
}
