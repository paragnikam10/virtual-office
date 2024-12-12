import { ItemType } from "../../../../../types/Items";
import Item from "./Item";

export default class Computer extends Item {
  id?: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.itemType = ItemType.COMPUTER;
  }
}
