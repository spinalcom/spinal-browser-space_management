import geographicService from "spinal-env-viewer-context-geographic-service";
import { SERVICE_NAME, SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME } from "spinal-service-ticket/dist/Constants";
import graph from "./GraphService";
import {serviceDocumentation} from "spinal-env-viewer-plugin-documentation-service";
const attributeType = "hasCategoryAttributes";
const geographicConstants = geographicService.constants;

let dataService = {
  ContextNode: {},
  ProcessNodes: {},
  StepsNodes: {},
  total: {},
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

  },
  // async bindTicketService(node) {
  //   return new Promise(resolve => {
  //     let context = await graph.SpinalGraphService.getContext(
  //       SERVICE_NAME );
  //   });
  // },
  // bindTicketProcess() {
  //   return new Promise(resolve => {
  //     let context = await graph.SpinalGraphService.getContext(
  //       SERVICE_NAME );
  //   });
  // },
  async getTickets(rooms, processInfo) {
    await graph.init();

    let context = await graph.SpinalGraphService.getContext(
      SERVICE_NAME );
    if (typeof context === "undefined")
      return Promise.resolve([]);
    this.ContextNode = context;

    let self = this;
    graph.SpinalGraphService.getChildren(context.info.id).then(allProcess => {
      self.getAllSteps(allProcess);
      self.ProcessNodes = allProcess; });

    for (var lvl in rooms)
        for (var room_nbr in rooms[lvl].rooms)
          if (typeof rooms[lvl].rooms[room_nbr].id !== "undefined")
            this.getTicketsPerRoom(lvl, room_nbr, rooms, processInfo);

    this.getProcessByLevel(rooms);
    return Promise.resolve([]);

  },
  getProcessByLevel(floor) {
    setTimeout(function() {

    for (var level in floor)
      for (var ticket in floor[level].rooms)
        if (floor[level].rooms[ticket].tickets !== undefined) {
          floor[level]['processNumber'] = {};
          for (var el in floor[level].rooms[ticket].tickets)
            if (floor[level].rooms[ticket].tickets[el]['processName'] !== undefined)
              if (floor[level]['processNumber'][ floor[level].rooms[ticket].tickets[el]['processName'] ] === undefined)
                floor[level]['processNumber'][ floor[level].rooms[ticket].tickets[el]['processName'] ] = 1;
              else {
                floor[level]['processNumber'][ floor[level].rooms[ticket].tickets[el]['processName'] ] = 
                floor[level]['processNumber'][ floor[level].rooms[ticket].tickets[el]['processName'] ] + 1
              }
        }

    }, 3000);
  },
  getAllSteps(allProcess) {
    let self = this;
    for (var process in allProcess) {
      graph.SpinalGraphService.getChildren(allProcess[process].id.get()).then(child => {
        for (var nodeId in child) {
          self.StepsNodes[child[nodeId].id.get()] = graph.SpinalGraphService.getRealNode(child[nodeId].id.get());
        }
      })
    }
  },
  getTicketsPerRoom(lvl, room_nbr, rooms, processInfo) {
    graph.SpinalGraphService.getChildren(rooms[lvl].rooms[room_nbr].id, SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME)
      .then(children => {
        if (children.length > 0) {
            rooms[lvl]['count'] = children.length;
            rooms[lvl].rooms[room_nbr]['tickets'] = [];
            rooms[lvl].rooms[room_nbr]['tickets'] = children.slice(0, children.length);
            this.addInfoToTicket(children.slice(0, children.length), processInfo);
        }
    })
  },
  addInfoToTicket(tickets, processInfo) {
    let processe;
    this.total['count'] = {};
    let self = this;
    setTimeout(function() {
    for (var ticket in tickets) {
      processe = graph.SpinalGraphService.getRealNode(tickets[ticket].processId.get())

      if (processe !== undefined) {
        if (self.total['count'][processe.info.name.get()] === undefined) {
          self.total['count'][processe.info.name.get()] = 1;
        }
        else {
          self.total['count'][processe.info.name.get()] = self.total['count'][processe.info.name.get()] + 1;
        }
      }
    }
    }, 2000)
  },
  async getRooms(floors) {
    await graph.init();

    return Promise.all(floors.map(async el => {

      return {
        floor: el.name,
        rooms: await this.getFloorRooms(el.id)
      };
    }))
  },
  async extractRoomData(obj) {
    console.log("in extract");
    let info = [];
    obj['room'] = info;

    let context = await graph.SpinalGraphService.getContext(
      "Space" );

    if (typeof context === "undefined")
      return Promise.resolve([]);

    let self = this;
    graph.SpinalGraphService.getChildren(context.info.id).then(allProcess => {
      for (nodes in allProcess) {
        console.log("nodes ==------------------------- ", allProcess[nodes].name.get());
        info.push(allProcess[nodes]);
        this.getGroupInfo(allProcess[nodes]);
      }
    });

  },
  getGroupInfo(node) {
    node['group'] = [];
    graph.SpinalGraphService.getChildren(node.id.get()).then(allGroup => {
      for (nodes in allGroup) {
        node['group'].push(allGroup[nodes]);
        //node.push(allGroup[nodes]);
        // console.log("nodes = ", allGroup[nodes].name.get());
        this.getRoomInfo(allGroup[nodes]);
      }
    });
  },
  getRoomInfo(group) {
    group['allRooms'] = [];
    graph.SpinalGraphService.getChildren(group.id.get()).then(allRoom => {
      for (nodes of allRoom) {
        group['allRooms'].push(nodes);
        //console.log("nodes ON group = ", nodes);
        this.extractInfo(nodes);
      }
    });
  },
  extractInfo(room) {
    room['space'] = [];
    graph.SpinalGraphService.getChildren(room.id.get()).then(allSpace => {
      for (nodes in allSpace) {
        room['space'].push(allSpace[nodes]);
        // console.log("--------------------L>", room);
        this.extractSpace(allSpace[nodes]);
        //console.log("nodes ON group = ", allSpace[nodes].name.get());
      }
    });
  }, // getrealnode -> getchildren -> getchildren 
  async extractSpace(space){
    let rnode = graph.SpinalGraphService.getRealNode(space.id.get());

    let test = await rnode.getChildren([attributeType]);
    let valu;
    let iterator = 0;
    if (test[0] && test[0].info.name.get() === "space") {
       valu = await test[0].element.load()
       space['space'] = valu[0].value.get();
      //onsole.log("space detected!", valu[0].value.get(), "for ", space.name.get());
    }
  },
  async getEquipments(floors) {
    for (var index in floors)
      for (var floor in floors[index])
        for (var room in floors[index][floor])
          if (typeof floors[index][floor][room].id !== "undefined")
           this.addEquipmentInRoom(floors[index][floor][room].id, floors, index, floor, room);

    return Promise.resolve([]);
  },
  addEquipmentInRoom(id, floor, index, floor_lvl, room) {
    graph.SpinalGraphService.getChildren(id, 'hasBIMObject' ).then(equipmments => {
      floor[index][floor_lvl][room]['equipements'] = [];
      floor[index][floor_lvl][room]['equipements'] = equipmments
    });
  },
  getFloorRooms(floorId) {
    return graph.SpinalGraphService.findNodes(floorId, geographicConstants
      .GEOGRAPHIC_RELATIONS, (node) => {
        graph.SpinalGraphService._addNode(node);
        return node.getType().get() === geographicConstants.ROOM_TYPE
      }).then(res => {
      return res.map(el => {
        return el.info.get();
      })
    })
  },
  getProcessName(obj) {
    let allProcess = [];
    let icons = [];
    obj['process'] = allProcess;
    obj['icon'] = icons;
    let self = this;
    setTimeout(function() {
      for (var node in self.ProcessNodes) {
        allProcess.push(self.ProcessNodes[node].name.get());
        icons[self.ProcessNodes[node].name.get()] = self.ProcessNodes[node].icon.get()
      }
    }, 2000);
  },
  async getAllData() {
    let processName = {};

    let floors = await this.getFloor();
    let rooms = await this.getRooms(floors);
    this.getTickets(rooms, processName);
    this.getEquipments(rooms);
    this.getProcessName(processName);
    this.extractRoomData(processName);
    
    return {
      floors: floors,
      rooms: rooms,
      process: processName['process'],
      processIcons: processName['icon'],
      roomData: processName['room'],
      totalTickets: this.total,
      equipements: ''
    }
  },
  async getBimObjects(id) {
    await graph.init();

    return graph.SpinalGraphService.findNodes(id, geographicConstants
      .GEOGRAPHIC_RELATIONS, (node) => {
        graph.SpinalGraphService._addNode(node);
        return node.getType().get() === geographicConstants.EQUIPMENT_TYPE
      }).then(res => {

      return res.map(el => {
        return el.info.dbid.get();
      })
    })
  },

}

export default dataService;