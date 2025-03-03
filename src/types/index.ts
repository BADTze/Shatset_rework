export interface IModeSearchParams {
    mode?: string;
    date?: string;
    month?: string;
    year?: string;
    runningHour?: number;
    rHourPeriod?:number;
    statusData?: number;
    loadPersen?: number | any;
    loadData?: number | any;
  }
  
  export interface RHPData {
    DateTime: string;
    Value: number;
    TagName: string;
    Unit: string;
  }
  
  
  
  