/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
import {
  SpinalGraphService
} from 'spinal-env-viewer-graph-service';
import {
  spinalIO
} from './spinal-io';
var throttle = require('lodash.throttle');
import { SCENE_RELATION_NAME, PART_RELATION_NAME, SCENE_RELATION_TYPE } 
  from "spinal-env-viewer-plugin-scene/src/constants";

export class GraphService {
  constructor() {
    this.SpinalGraphService = SpinalGraphService;
    this.initPromise = null;
    this.graphID = null;
    this.OccupantGrpSet = new Set();
  }
  init() {
    if (this.initPromise !== null) return this.initPromise;
    const func = async (resolve, reject) => {
      try {
        const graph = await spinalIO.getPathModel();
        this.graphID = await this.SpinalGraphService
            .setGraph(graph);

        resolve(this.graphID);
      } catch (e) {
        reject(e);
      }
    };
    this.initPromise = new Promise(func);
    return this.initPromise;
  }
  getScene() {
      let sceneContextLst = SpinalGraphService.getContextWithType("SpinalService")
      let sceneContext = sceneContextLst[0]
      console.log(sceneContext);
      return sceneContext.getChildren(SCENE_RELATION_NAME);    
  }

  async getOccupations(onChangeFunc) {
    await this.init();
    const context = await this.SpinalGraphService.getContext('geo');

    // this.getOccupationsFuncBinded = throttle(() => {
    //   this.getOccupationsFunc().then((res) => {
    //     onChangeFunc(res);
    //   });
    // }, 1000);
    console.log(context);

    //context.bind(this.getOccupationsFuncBinded);
  }

  async getContext(name) {
    await this.init();
    const context = await this.SpinalGraphService.getContext(name);

    return context;
  }

  getRealNode(id) {
    return this.SpinalGraphService.getRealNode(id);
  }

  async getcHILDREN(id, relationName = []) {
    const children = await this.SpinalGraphService.getChildren(id,
      relationName);

    return children;
  }

  async getOccupationsFunc() {
    await this.init();
    const context = await this.SpinalGraphService.getContext('Occupation');
    const occupationId = context.info.id.get();
    const ocupationGrpLst = await this.SpinalGraphService
      .getChildrenInContext(occupationId, occupationId);

    const res = [];
    for (let idx = 0; idx < ocupationGrpLst.length; idx++) {
      const ocupationGrp = ocupationGrpLst[idx];
      if (!this.OccupantGrpSet.has(ocupationGrp)) {
        this.OccupantGrpSet.add(ocupationGrp);
        const nodeModel = this.SpinalGraphService.getRealNode(ocupationGrp.id
          .get());
        nodeModel.bind(this.getOccupationsFuncBinded);
      }
      const obj = {
        name: ocupationGrp.name.get(),
        promise: this.SpinalGraphService.getChildrenIds(ocupationGrp.id
          .get())
      };
      if (typeof ocupationGrp.color !== 'undefined') {
        obj.color = ocupationGrp.color.get();
      }
      res.push(obj);
    }
    const tmp = [];
    for (let idx = 0; idx < res.length; idx++) {
      // eslint-disable-next-line no-await-in-loop
      const children = await res[idx].promise;
      // const o = ;
      tmp.push({
        name: res[idx].name,
        color: res[idx].color,
        children: children
      });
    }
    return tmp;
  }

}

const graphService = new GraphService;

export default graphService;