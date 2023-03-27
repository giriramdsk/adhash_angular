export class TrimEngine {
    [x: string]: any;
    make?:string;
    model?:string;
    year?:string;
    value!:TrimEngineValue[]
    trim: string;
    engine: string;
    checked?: boolean;
    selected?:boolean;
    constructor(trim: string, engine: string,make:string) {
      this.trim = trim;
      this.engine = engine;
      this.checked = false;
      this.selected= false;

    }
  }
   
  export class TrimEngineValue{
    trim!: string;
    engine!: string;
    id!:string

  }