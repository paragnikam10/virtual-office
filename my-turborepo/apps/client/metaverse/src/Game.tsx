import Phaser from "phaser";
import React, { useEffect, useRef, useState } from "react";


/*export default class OfficeScene extends Phaser.Scene {
  private ws: WebSocket | null = null;
  private players: { [key: string]: Phaser.GameObjects.Sprite } = {};
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private playerId: string | null = null;
  private moveSpeed: number = 2;

  constructor() {
    super("OfficeScene");
  }

  preload() {
    this.load.spritesheet("player", "path/to/player/sprite.png", {
      frameWidth: 200,
      frameHeight: 200,
    });
    this.load.image("map", "path/to/map/image.png");
  }

  create() {
    this.add.image(600, 300, "map");

    this.ws = new WebSocket("ws://localhost:3001");

    this.ws.onmessage = (event) => {
      console.log("event", event)
      const data = JSON.parse(event.data);

      if (data.type === "init") {
        this.playerId = data.playerId;
        this.players = {};

        data.players.forEach(([id, position]: [string, { x: number; y: number }]) => {
          this.addPlayer(id, position.x, position.y);
        });
      } else if (data.type === "update") {
        if (!this.players[data.playerId]) {
          this.addPlayer(data.playerId, data.x, data.y);
        } else {
          this.players[data.playerId].x = data.x;
          this.players[data.playerId].y = data.y;
        }
      } else if (data.type === "disconnect") {
        if (this.players[data.playerId]) {
          this.players[data.playerId].destroy();
          delete this.players[data.playerId];
        }
      }
    };

    if (this.playerId) {
      this.addPlayer(this.playerId, 400, 300); // Add the local player
    }

    this.cursors = this.input.keyboard!.createCursorKeys();
    console.log("Cursors", this.cursors)

  }

  private addPlayer(playerId: string, x: number, y: number): void {
    const newPlayer = this.add.sprite(x, y, "player");
    this.players[playerId] = newPlayer;
  }

  update() {
    if (!this.playerId || !this.players[this.playerId]) {
      return;
    }

    const playerSprite = this.players[this.playerId];
    let moved = false;

    if (this.cursors.left.isDown) {
      console.log("moved")
      playerSprite.x -= this.moveSpeed;
      moved = true;
    } else if (this.cursors.right.isDown) {
      playerSprite.x += this.moveSpeed;
      moved = true;
    }

    if (this.cursors.up.isDown) {
      playerSprite.y -= this.moveSpeed;
      moved = true;
    } else if (this.cursors.down.isDown) {
      playerSprite.y += this.moveSpeed;
      moved = true;
    }

    if (moved && this.ws) {
      this.ws.send(
        JSON.stringify({
          type: "move",
          playerId: this.playerId,
          x: playerSprite.x,
          y: playerSprite.y,
        })
      );
    }
  }
}*/
import cloudDay from './assets/background/cloud_day.png';
import cloudDayJson from './assets/background/cloud_day.json';
import backdropDay from './assets/background/backdrop_day.png';
import cloudNight from './assets/background/cloud_night.png';
import cloudNightJson from './assets/background/cloud_night.json';
import backdropNight from './assets/background/backdrop_night.png';
import sunMoon from './assets/background/sun_moon.png';
import mapJson from './assets/map/map.json';
import floorAndGround from './assets/map/FloorAndGround.png';
import chairs from './assets/items/chair.png';
import computers from './assets/items/computer.png';
import whiteboards from './assets/items/whiteboard.png';
import vendingMachines from './assets/items/vendingmachine.png';
import Modern_Office_Black_Shadow from './assets/tileset/Modern_Office_Black_Shadow.png';
import basement from './assets/tileset/Basement.png';
import generic from './assets/tileset/Generic.png';
import adam from './assets/character/adam.png';
import ash from './assets/character/ash.png';
import lucy from './assets/character/lucy.png';
import nancy from './assets/character/nancy.png';
import Chair from "./items/Chair";
import Computer from "./items/Computer";
import Whiteboard from "./items/Whiteboard";
import VendingMachine from "./items/VendingMachine";
import { createCharacterAnims } from "./anims/characterAnims"

export const OfficeScene: React.FC = () => {
  const ws = useRef<WebSocket | null>(null);
  const cursors = useRef<Phaser.Types.Input.Keyboard.CursorKeys | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [players, setPlayers] = useState<{ [key: string]: Phaser.GameObjects.Sprite }>({});
  const moveSpeed = 2;
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)

  const handleSelectedCharacter = (character: string) => {
    console.log("Selected character:", character);
    setSelectedCharacter(character)

  }

  useEffect(() => {

    if (!selectedCharacter) return
    console.log("use effect ran", selectedCharacter)

    const GameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: "game_container",
      backgroundColor: '#93cbee',
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.ScaleModes.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight
      },
      scene: {
        preload,
        create,
        update
      },
      physics: {
        default: "arcade",
        arcade: {
          debug: false
        }
      },
      autoFocus: true,
    }

    const game = new Phaser.Game(GameConfig);

    return () => {
      game.destroy(true);
    }
  }, [selectedCharacter])

  const preload = function (this: Phaser.Scene) {
    // Backgrounds
    this.load.atlas(
      'cloud_day',
      cloudDay,
      cloudDayJson
    );
    this.load.image('backdrop_day', backdropDay);
    this.load.atlas(
      'cloud_night',
      cloudNight,
      cloudNightJson
    );
    this.load.image('backdrop_night', backdropNight);
    this.load.image('sun_moon', sunMoon);

    // Map and Tilesets
    this.load.tilemapTiledJSON('tilemap', mapJson);
    this.load.spritesheet('tiles_wall', floorAndGround, {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Items
    this.load.spritesheet('chairs', chairs, {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet('computers', computers, {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.spritesheet('whiteboards', whiteboards, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('vendingmachines', vendingMachines, {
      frameWidth: 48,
      frameHeight: 72,
    });

    // Tilesets
    this.load.spritesheet('office', Modern_Office_Black_Shadow, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('basement', basement, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('generic', generic, {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Characters
    this.load.spritesheet('adam', adam, {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet('ash', ash, {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet('lucy', lucy, {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet('nancy', nancy, {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  const create = function (this: Phaser.Scene) {

    this.add.image(0, 0, 'backdrop_day').setOrigin(0, 0).setDepth(-1);

    const map = this.make.tilemap({ key: 'tilemap' });

    const wallTileset = map.addTilesetImage('FloorAndGround', 'tiles_wall');
    //const officeTileset = map.addTilesetImage('Modern_Office_Black_Shadow', 'office');

    const groundLayer = map.createLayer('Ground', wallTileset!, 0, 0);
    //const furnitureLayer = map.createLayer('Furniture', officeTileset!, 0, 0);

    groundLayer?.setDepth(0);
    groundLayer?.setDepth(1);

    groundLayer?.setCollisionByProperty({ collides: true });
    console.log("'" + selectedCharacter + "'");

   
    console.log("anims",  createCharacterAnims)
    const player = this.add.sprite(400, 300, selectedCharacter!);
    createCharacterAnims(player.anims)
    player.setDepth(2);

    (this as any).player = player

    const chair = this.add.sprite(150, 200, 'chair');
    chair.setDepth(2);

    //importing chairs from Tiled map to Phaser
    const chairs = this.physics.add.staticGroup({ classType: Chair });
    const chairLayer = map.getObjectLayer('Chair');
    chairLayer?.objects.forEach((chairObj) => {
      const item = addObjectFromTiled(chairs, chairObj, 'chairs', 'chair', map) as Chair

      item.itemDirection = chairObj.properties[0].value
    })

    const computerMap = new Map<string, Computer>();
    const computers = this.physics.add.staticGroup({ classType: Computer });
    const computerLayer = map.getObjectLayer('Computer');
    computerLayer?.objects.forEach((obj, i) => {
      const item = addObjectFromTiled(computers, obj, 'computers', 'computer', map) as Computer
      item.setDepth(item.y + item.height * 0.27)
      const id = `${i}`
      item.id = id
      computerMap.set(id, item)
    })

    const whiteboardMap = new Map<string, Whiteboard>()
    const whiteboards = this.physics.add.staticGroup({ classType: Whiteboard });
    const whiteboardLayer = map.getObjectLayer('Whiteboard');
    whiteboardLayer?.objects.forEach((obj, i) => {
      const item = addObjectFromTiled(whiteboards, obj, 'whiteboards', 'whiteboard', map) as Whiteboard
      const id = `${i}`
      item.id = id
      whiteboardMap.set(id, item)
    })

    const vendingmachines = this.physics.add.staticGroup({ classType: VendingMachine })
    const vendingmachineLayer = map.getObjectLayer('VendingMachine')
    vendingmachineLayer?.objects.forEach((obj) => {
      addObjectFromTiled(vendingmachines, obj, 'vendingmachines', 'vendingmachine', map) as VendingMachine
    })

    addGroupFromTiled.call(this, 'Wall', 'tiles_wall', 'FloorAndGround', map)
    addGroupFromTiled.call(this, 'Objects', 'office', 'Modern_Office_Black_Shadow', map)
    addGroupFromTiled.call(this, 'ObjectsOnCollide', 'office', 'Modern_Office_Black_Shadow', map)
    addGroupFromTiled.call(this, 'GenericObjects', 'generic', 'Generic', map)
    addGroupFromTiled.call(this, 'GenericObjectsOnCollide', 'generic', 'Generic', map)
    addGroupFromTiled.call(this, 'Basement', 'basement', 'Basement', map)

    this.physics.add.collider(player, groundLayer!);

    ws.current = new WebSocket("ws://localhost:3001");
    cursors.current = this.input.keyboard!.createCursorKeys();

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "init") {
        setPlayerId(data.playerId);

        const newPlayers: { [key: string]: Phaser.GameObjects.Sprite } = {};
        data.players.forEach(([id, position]: [string, { x: number; y: number }]) => {
          const sprite = addPlayer(this, id, position.x, position.y);
          newPlayers[id] = sprite
        });
        setPlayers(newPlayers)
      } else if (data.type === "update") {
        setPlayers((prevPlayers) => {
          if (!prevPlayers[data.playerId]) {
            const sprite = addPlayer(this, data.playerId, data.x, data.y);
            return { ...prevPlayers, [data.playerId]: sprite }
          } else {
            const updatedPlayers = { ...prevPlayers };
            const player = updatedPlayers[data.playerId];
            player.x = data.x;
            player.y = data.y;
            return updatedPlayers
          }
        });
      } else if (data.type === "disconnect") {
        setPlayers((prevPlayers) => {
          const updatedPlayers = { ...prevPlayers };
          if (updatedPlayers[data.playerId]) {
            updatedPlayers[data.playerId].destroy();
            delete updatedPlayers[data.playerId]
          }
          return updatedPlayers;
        });
      }
    };
    if (playerId) {
      const sprite = addPlayer(this, playerId, 400, 300);
      setPlayers((prevPlayers) => ({ ...prevPlayers, [playerId]: sprite }))
    }
  };

  const update = function (this: Phaser.Scene) {
    // if (!playerId || !players[playerId]) return;
    // const playerSprite = players[playerId];
    const player = (this as any).player
    if (!player) return
    let moved = false;

    if (cursors.current?.left.isDown) {
      player.x -= moveSpeed;
      player.anims.play(selectedCharacter +'_idle_left', true)
      moved = true;
      console.log(moved)
    } else if (cursors.current?.right.isDown) {
      player.x += moveSpeed;
      player.anims.play(selectedCharacter +'_idle_right', true)
      moved = true;
      console.log(moved)
    }

    if (cursors.current?.up.isDown) {
      player.y -= moveSpeed;
      player.anims.play(selectedCharacter +'_idle_up', true)
      moved = true;
      console.log(moved)
    } else if (cursors.current?.down.isDown) {
      player.y += moveSpeed;
      player.anims.play(selectedCharacter +'_idle_down', true)
      moved = true;
      console.log(moved)
    }

    if (moved && ws.current) {
      ws.current.send(
        JSON.stringify({
          type: "move",
          playerId: playerId,
          x: player.x,
          y: player.y
        })
      );
    }
  };

  function addObjectFromTiled(
    group: Phaser.Physics.Arcade.StaticGroup,
    object: Phaser.Types.Tilemaps.TiledObject,
    key: string,
    tilesetName: string,
    map: Phaser.Tilemaps.Tilemap // Pass the map as a parameter
  ) {
    const actualX = object.x! + object.width! * 0.5;
    const actualY = object.y! - object.height! * 0.5;

    const tileset = map.getTileset(tilesetName);
    if (!tileset) {
      throw new Error(`Tileset ${tilesetName} not found in the map.`);
    }

    const obj = group
      .get(actualX, actualY, key, object.gid! - tileset.firstgid) // Calculate frame
      .setDepth(actualY); // Set depth based on Y-coordinate for proper layering

    return obj;
  }

  function addGroupFromTiled(
    this: Phaser.Scene,
    objectLayerName: string,
    key: string,
    tilesetName: string,
    map: Phaser.Tilemaps.Tilemap

  ) {
    const tileset = map.getTileset(tilesetName);
    const group = this.physics.add.staticGroup()
    const objectLayer = map.getObjectLayer(objectLayerName)
    objectLayer?.objects.forEach((object) => {
      const actualX = object.x! + object.width! * 0.5;
      const actualY = object.y! - object.height! * 0.5;
      group.get(actualX, actualY, key, object.gid! - tileset!.firstgid).setDepth(actualY)
    })
  }

  const addPlayer = (scene: Phaser.Scene, _id: string, x: number, y: number): Phaser.GameObjects.Sprite => {
    return scene.add.sprite(x, y, "player");

  }

  return (
    <>
      {!selectedCharacter ? (
        <div className="character_selection">
          <h2>Select Your Character</h2>
          <button onClick={() => handleSelectedCharacter("adam")}>Adam</button>
          <button onClick={() => handleSelectedCharacter("ash")}>Ash</button>
          <button onClick={() => handleSelectedCharacter("lucy")}>Lucy</button>
          <button onClick={() => handleSelectedCharacter("nancy")}>Nancy</button>
        </div>
      ) : (
        <div id="game_container"></div>
      )}
    </>

  )
}















