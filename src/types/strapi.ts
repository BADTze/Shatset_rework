export interface RMachine {
    data: IMachine;
    meta: Meta;
  }
  
  export interface RMachines {
    data: IMachine[];
    meta: Meta;
  }
  
  export interface IMachine {
    id: number;
    attributes: IMachineAttributes;
  }
  
  export interface IMachineAttributes {
    function_code: string;
    asset_name: string;
    createdAt: Date;
    updatedAt: Date;
    photo_asset: IMachinePhotoAsset;
    aveva_tag_status:string;
    machine_running_hour_tag:string;
    shatset_data_trends: { data: IDataTrend[] };
  }
  
  export interface IMachinePhotoAsset {
    data: PhotoAssetDatum[];
  }
  
  export interface PhotoAssetDatum {
    id: number;
    attributes: {
      name: string;
      url: string;
    };
  }
  
  export interface Meta {
    pagination: Pagination;
  }
  
  export interface Pagination {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  }
  
  export interface IDataAttribute {
    aveva_tag: string;
    label: string;
    uom: string;
    std_max: number;
    std_min: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface IDataTrend {
    id: number;
    attributes: IDataAttribute;
  }
  