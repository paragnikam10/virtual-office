import Phaser from "phaser";
import { ItemType } from "../../../../../types/Items";

export default class Item extends Phaser.Physics.Arcade.Sprite {
  itemType!: ItemType;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
  }
}
