function WAG(canvas) {
  this.canvas = document.getElementById(canvas);

  this.perFragmentProgram = null;
  this.spotlightProgram = null;

  this.programs = {
    perFragment: {
      fragment: "includes/lighting-fs.frag",
      vertex:   "includes/lighting-vs.vert"
    },
    spotlight: {
      fragment: "includes/spotlight-fs.frag",
      vertex:   "includes/spotlight-vs.vert"
    }
  };

  this.initialize = function() {
    try {
      gl = this.canvas.getContext("experimental-webgl");
      gl.viewportWidth = this.canvas.width;
      gl.viewportHeight = this.canvas.height;
    } catch(e) {
    }
    if (!gl) {
      alert("Could not initialise WebGL, sorry :-(");
    }

    this.initShaders(function() {
      // Initializes the architecture and textures of the room
      room.initialize();

      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      gl.clearDepth(1.0);

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL)

      gl.enable(gl.CULL_FACE);

      //gl.enable(gl.LIGHTING);

      document.onkeydown = handleKeyDown;
      document.onkeyup = handleKeyUp;

      $('#categoryChanger').submit(this.changeCategory);

      setInterval(function() {
        handleKeys();
        drawScene();
        animate();
      }, 33);
    }.bind(this));
  }

  this.initShaders = function(cb) {
    // No need for per-fragment shader to wait for the other shaders
    createProgram("perFragment", function(prog) {
      this.perFragmentProgram = prog;
      cb();
    }.bind(this));
    createProgram("spotlight", function(prog) {
      this.spotlightProgram = prog;
    }.bind(this));
  }

  /**
   * Callback called by /category/:cat
   */
  this.handleCategoryImages = function(data) {
    if (data.resultCode != 0) {
      alert("Error in retrieving category: " + data.resultCode);
    } else {
      $('#loadingtext').hide();
      room.clearPaintings();
      for (var i in data.data) {
        var preload = new Image();
        preload.onload = function() {
          room.addPainting({
            img: this.src,
            width: this.width,
            height: this.height
          });
        };
        preload.src = data.data[i].thumb_url;
      }
    }
  }

  this.changeCategory = function() {
    var category = $('#categoryInput').val();

    $('#loadingtext').show();

    // Since the node is on a different domain, we can't use Ajax.
    $('head').append('<script type="text/javascript" '+
      'src="http://node.art.kimbei.com/category/'+encodeURI(category)+
      '"></script>');

    return false;
  }

  this.onTeleport = function() {
    $(this.canvas).fadeOut(300, function() {
      $(this.canvas).fadeIn(300);
    }.bind(this));
  }

}
