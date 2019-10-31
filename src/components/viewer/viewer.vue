<template>
  <div class="viewerContainer"
       id="autodesk_forge_viewer">
  </div>
</template>

<script>
import { ForgeViewer } from "spinal-forge-viewer";
import { EventBus } from "../../config/event";

import dataService from "../../config/data";
import { setTimeout } from "timers";
import GraphService from "../../config/GraphService";
import 'spinal-env-viewer-plugin-forge';

export default {
  name: "appViewer",
  data() {
    return {
      viewer: null,
      ticketToZoom: {},
      colors: {},
      materials: {}
    };
  },

  async mounted() {
    this.getEvents();
      const container = document
        .getElementById( "autodesk_forge_viewer" );

    // await forgeViewer.start_viewer('

    this.forgeViewer = new ForgeViewer( container, false);

   await this.forgeViewer.start( '/models/Resource/3D View/{3D} 341878/{3D}.svf',
          true );
    await window.spinal.SpinalForgeViewer.initialize(this.forgeViewer);

    let scenes = await GraphService.getScene();

    await window.spinal.SpinalForgeViewer.loadModelFromNode(scenes[0].info.id.get());
    this.viewer = this.forgeViewer.viewer;
    this.createSetColor();
    this.createRestoreColor();

  },
  methods: {
    getEvents() {
      EventBus.$on("click-event", item => this.isolateObjects(item.id) );

      EventBus.$on("click-ticket-event", item => this.zoomObjects(item.id) );

      EventBus.$on("mouse-over", item => this.selectObjects(item.id) );

      EventBus.$on("select-equipment", itemId => this.selectObjects(itemId) );

      EventBus.$on("test", id => this.selectObjects(id));

      EventBus.$on("select-tickets-room", items => 
      {
        this.viewer.clearSelection();
        let self = this;
        items.forEach(x => self.selectObjects(x.info.id.get()));
      });

      EventBus.$on("mouse-leave", () => this.viewer.select() );

      EventBus.$on("click-details", item =>  { 
        this.selectObjects(item)        
        let self = this;
        setTimeout(function() {
          self.zoomObjects(item);
        }, 100);
        });

      EventBus.$on("click-room", item => this.zoomObjects(item));

      EventBus.$on("display-colors", items => this.displayTicketsColor(items) );

      EventBus.$on("reset-select", () => {
        this.viewer.isolate(0);
        this.viewer.fitToView(0); 
      });
    },
    createSetColor() {
      let _self = this;
      this.viewer.setColorMaterial = function(
      objectIds,
      color
    ) {
        for (var i = 0; i < objectIds.length; i++) {
          var dbid = objectIds[i];


          if (_self.materials[dbid]) {
            _self.materials[dbid].color.setHex(parseInt(_self.cutHex(color),
              16));
            _self.viewer.impl.invalidate(false, false, true);
          } else {
            var material = _self.addMaterial(color, dbid);

            let it = _self.viewer.model.getData().instanceTree;
            it.enumNodeFragments(
              dbid,
              function(fragId) {
                var renderProxy = _self.viewer.impl.getRenderProxy(
                  _self.viewer.model,
                  fragId
                );
                renderProxy[dbid] = new THREE.Mesh(
                  renderProxy.geometry,
                  material
                );

                renderProxy[dbid].matrix.copy(renderProxy.matrixWorld);
                renderProxy[dbid].matrixWorldNeedsUpdate = true;
                renderProxy[dbid].matrixAutoUpdate = false;
                renderProxy[dbid].frustumCulled = false;

                _self.viewer.impl.addOverlay(dbid, renderProxy[dbid]);
                _self.viewer.impl.invalidate(true);
              },
              false
            );
          }
        }
      }

    },
    cutHex(h) {
      return h.charAt(0) == "#" ? h.substring(1, 7) : h;
    },
    addMaterial(color, id) {
      let _self = this;
      this.materials[id] = new THREE.MeshPhongMaterial({
        color: color
      });

      this.viewer.impl.createOverlayScene(
        id,
        _self.materials[id],
        _self.materials[id]
      );
      return _self.materials[id];
    },
    createRestoreColor() {
      let _self = this;
    this.viewer.restoreColorMaterial = function(
      objectIds
    ) {
      for (var i = 0; i < objectIds.length; i++) {
        var dbid = objectIds[i];

        var it = _self.viewer.model.getData().instanceTree;

        if (_self.materials[dbid]) delete _self.materials[dbid];

        it.enumNodeFragments(
          dbid,
          function(fragId) {
            var renderProxy = _self.viewer.impl.getRenderProxy(
              _self.viewer.model,
              fragId
            );

            if (renderProxy[dbid]) {
              _self.viewer.impl.clearOverlay(dbid);
              delete renderProxy[dbid];

              _self.viewer.impl.invalidate(true);
            }
          },
          true
        );
      }
      }

    },
    selectObjects(id) {
      dataService.getBimObjects(id).then(res => {
        this.viewer.select(res);
      });
    },
    zoomObjects(id) {
      let selection = this.viewer.getSelection();
      
      setTimeout(() => {
        this.viewer.fitToView(selection);
      }, 1)
      this.viewer.fitToView([selection]);
      
    },
    displayTicketsColor(items) {
      let self = this;
      let realNode;
      this.ticketToZoom = [];
      this.colors = {}
      let iterator = 0;
            for (var node in items) {
              realNode = graph.SpinalGraphService.getRealNode(items[node].id.get());
              self.colors[iterator] = items[node].color.get();

               realNode.find( [
                 'SpinalSystemServiceTicketHasLocation',
                 "hasBIMObject",
                 'hasReferenceObject'
               ],
               self.predicat
               )
               .then( lst => {
                 let result = lst.map( function(x) { return (x.info.dbid.get()) });
                 self.ticketToZoom.push(result);
               } );
               iterator++

            }

      setTimeout(function() {
        self.setColorMaterial()
      }, 1);
      
       window.addEventListener("click", this.eventForColor, true);
    },
    predicat: function( node ) {
      return node.info.type.get() === "BIMObject";
    },
    eventForColor: function(event) {
      for (var i in this.ticketToZoom) {
        this.viewer.restoreColorMaterial(this.ticketToZoom[i])
      }
      window.removeEventListener("click", this.eventForColor, true);
      event.preventDefault();
    },
    setColorMaterial: function() {
      let self = this;
      var iterator = 0;
      let color;
      let loop = 0;
      var x = setInterval(function() {
        color = self.colors[iterator].replace(/#/g, "0x");
        self.viewer.setColorMaterial(self.ticketToZoom[iterator], color)
        iterator++;
        if (self.ticketToZoom[iterator] === undefined && loop === 0) {
          iterator = 0;
          loop = 1;
        } else if (self.ticketToZoom[iterator] === undefined && loop === 1) {
          clearInterval(x);
        }
      }, 10);
    },
    isolateObjects(id) {
      dataService
        .getBimObjects(id)
        .then(res => {
          this.viewer.isolate(res);
          this.viewer.fitToView(res);
          return;
        })
    },

    setCameraToTopView() {}
  }
};
</script>

<style scoped>
.viewerContainer {
  width: 51%;
  height: calc(93.5%);
  position: relative;
  float: left;
  padding-left: 160px;
}

@media screen and (max-width: 992px) {
  .viewerContainer {
    width: 85%;
    height: 470px !important;
    position: relative;
    float: left;
    padding-left: 160px;
  }
}


</style>
