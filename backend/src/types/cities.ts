export interface City {
    city_id: string;
    city_name_en: string;
    city_name_si: string;
    city_name_ta: string;
    sub_name_en: string | null;
    sub_name_si: string | null;
    sub_name_ta: string | null;
    postcode: string;
    latitude: string;
    longitude: string;
    district_id: string;
    district_name_en: string;
    district_name_si: string;
    district_name_ta: string;
    province_id: string;
    province_name_en: string;
    province_name_si: string;
    province_name_ta: string;
  }
  
  export interface District {
    district_id: string;
    district_name_en: string;
    district_name_si: string;
    district_name_ta: string;
    province_id: string;
  }
  
  export interface Province {
    province_id: string;
    province_name_en: string;
    province_name_si: string;
    province_name_ta: string;
  }
  
  export interface CityData {
    cities: City[];
  }
  