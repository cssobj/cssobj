// declare module "cssobj"{}

// main function
export default function cssobj (obj: Object, options?: Options, data?: any): Result;

interface Options {
  local?: boolean | LocalOption;
  cssom?: cssomOption;
}

interface cssomOption {
  name?: string;
  attrs?: Object;
}

interface LocalOption {
  prefix?: string;
  localNames?: Object;
}

interface HTMLStyleElement {
  id?: string;
  className?: string;
  sheet?: Object;
  styleSheet?: Object;
  media?: string;
}

interface Node {
  children: Object;
  diff?: Object;
  lastVal?: Object;
  parentRule: any;
  prevVal: any;
  prop: Object;
}

interface Result {
  update (data?: any): Result;
  cssom: HTMLStyleElement;
  data: Object;
  nodes: Node[];
  obj: Object;
  options: Options;
  ref: Object;
  root: Node;
}
