export interface CharacterTrait {
  [traitKey: string]: boolean;
}

export interface Character {
  id: number;
  name: string;
  traits: CharacterTrait;
} 