import type { Image } from "./image";

export enum CosmeticType {
    Picture = 'Picture',
    Border = 'Border',
    Banner = 'Banner'
}

export interface Cosmetic {
    id: number;
    name: string;
    type: CosmeticType;
    image: Image;
    cost: number;
    purchaseable?: true | boolean;
}