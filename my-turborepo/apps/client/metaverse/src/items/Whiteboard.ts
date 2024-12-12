import { ItemType } from "../../../../../types/Items";
import Item from "./Item";

export default class Whiteboard extends Item {
  id?: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.itemType = ItemType.WHITEBOARD;
  }
}
