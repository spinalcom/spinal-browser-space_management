import geographicService from "spinal-env-viewer-context-geographic-service"
import graph from "../../config/GraphService";

const geographicConstants = geographicService.constants;




let sidebarService = {
  async getFloor() {
    await graph.init();

    let context = await graph.SpinalGraphService.getContext(
      geographicConstants
      .FLOOR_REFERENCE_CONTEXT);


    if (typeof context === "undefined")
      return Promise.resolve([]);

    return graph.SpinalGraphService.getChildren(context.info.id.get(), [
      geographicConstants
      .FLOOR_RELATION
    ]).then(children => {

      return children.map(el => {
        return el.get();
      })

    })

  }
}


export {
  sidebarService
}