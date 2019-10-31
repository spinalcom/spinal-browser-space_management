import {
  spinalIO
} from "../../config/spinal-io";

let $ = require("jquery");

import ForgeExtentionManager from "./ForgeExtentionManager";
let forgeExtentionManager = new ForgeExtentionManager();

class ForgeViewer {
  constructor() {
    this.viewer;
    this.config = {};
    this.options = {
      env: "Local",
      docid: "",
      useADP: false
    };
    this.docs = [];
  }

  start_viewer(dom) {
    let _self = this;

    let argPath = spinalIO.getModelPath();

    spinalIO.load(argPath)
      .then(forgefile => {
        this.forgeFile = forgefile;
        this.docs = this.forgeFile._children.get();
        if (this.docs.length != 0) {
          var path = this.docs[0].path;
          for (var i = 0; i < this.docs.length; i++) {
            if (/.+\.svf$/.test(this.docs[i].path)) {
              path = this.docs[i].path;
              break;
            }
          }
          path = window.location.origin + path;
          this.options.docid = path;
        }
        this.viewer = new window.Autodesk.Viewing.Private.GuiViewer3D(
          dom,
          this.config
        ); // With toolbar

        window.Autodesk.Viewing.Initializer(this.options, () => {
          this.viewer.initialize();
          this.viewer.loadModel(
            this.options.docid,
            this.config,
            onItemLoadSuccess,
            onDocumentLoadFailure
          );
        });

        function onDocumentLoadFailure(viewerErrorCode) {
          console.error(
            "onDocumentLoadFailure() - errorCode:" + viewerErrorCode
          );
        }

        function onItemLoadSuccess() {
          let extensions = forgeExtentionManager
            .getExtentions();
          for (var i = 0; i < extensions.length; i++) {
            _self.viewer.loadExtension(extensions[i], _self.options);
          }
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

}

export default ForgeViewer