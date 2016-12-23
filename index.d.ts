// cssobj definition

declare namespace CssObj {
    interface Config {
      local?: boolean | LocalOption;
      cssom?: CssomOption;
      plugins?: any[];
      state?: Object;
    }

    interface CssomOption {
      id?: string;
      frame?: any;
      vendors?: string[];
      append?: boolean;
      attrs?: Object;
      noMedia?: boolean;
    }

    interface LocalOption {
      space?: string;
      random?(): string;
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
      state: Object;
      nodes: Node[];
      obj: Object;
      config: Config;
      ref: Object;
      root: Node;
      space: string;
      localNames: Object;
      mapClass(classList: string): string;
      mapSel(selector: string): string;
    }

    interface Static {
        (obj: Object, config?: Config, state?: any): Result;
    }
}

declare module 'cssobj' {
    const cssobj: CssObj.Static
    export = cssobj
}
