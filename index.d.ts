// cssobj definition

declare namespace CssObj {
    interface Options {
      local?: boolean | LocalOption;
      cssom?: cssomOption;
      plugins?: any[];
    }

    interface cssomOption {
        id?: string,
        frame?: any,
        vendors?: string[],
        append?: boolean,
        attrs?: Object,
        noMedia?: boolean
    }

    interface LocalOption {
      space?: string;
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
      update (obj?:Object, state?: any): Result;
      cssom: HTMLStyleElement;
      data: Object;
      nodes: Node[];
      obj: Object;
      options: Options;
      ref: Object;
      root: Node;
    }

    interface Static {
        (obj: Object, options?: Options, state?: any): Result;
    }
}

declare module 'cssobj' {
    const cssobj: CssObj.Static
    export = cssobj
}
