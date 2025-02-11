import type { Node } from 'unist';

export interface TextNode extends Node { 
  type: 'text';
  value: string;
}