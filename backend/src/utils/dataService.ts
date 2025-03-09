import { promises as fs } from "fs";
import path from "path";
import { City, CityData, District, Province } from "../types/cities";

class DataService {
  private citiesData: City[] | null = null;
  private districts: District[] | null = null;
  private provinces: Province[] | null = null;

  async loadData(): Promise<void> {
    try {
      const citiesPath = path.join(__dirname, "../../data/cities.json");
      const rawData = await fs.readFile(citiesPath, "utf8");
      const parsedData: CityData = JSON.parse(rawData);
      this.citiesData = parsedData.cities;

      this.initializeDistrictsAndProvinces();

      console.log("Data loaded successfully");
    } catch (error) {
      console.error("Error loading data:", error);
      throw error;
    }
  }

  private initializeDistrictsAndProvinces(): void {
    if (!this.citiesData) return;

    // Initialize districts
    const districtsMap = new Map<string, District>();
    this.citiesData.forEach((city) => {
      if (!districtsMap.has(city.district_id)) {
        districtsMap.set(city.district_id, {
          district_id: city.district_id,
          district_name_en: city.district_name_en,
          district_name_si: city.district_name_si,
          district_name_ta: city.district_name_ta,
          province_id: city.province_id,
        });
      }
    });
    this.districts = Array.from(districtsMap.values());

    // Initialize provinces
    const provincesMap = new Map<string, Province>();
    this.citiesData.forEach((city) => {
      if (!provincesMap.has(city.province_id)) {
        provincesMap.set(city.province_id, {
          province_id: city.province_id,
          province_name_en: city.province_name_en,
          province_name_si: city.province_name_si,
          province_name_ta: city.province_name_ta,
        });
      }
    });
    this.provinces = Array.from(provincesMap.values());
  }

  isDataLoaded(): boolean {
    return this.citiesData !== null;
  }

  getCities(): City[] {
    if (!this.citiesData) {
      throw new Error("Data not loaded");
    }
    return this.citiesData;
  }
  getDistricts(): District[] {
    if (!this.districts) {
      throw new Error("Data not loaded");
    }
    return this.districts;
  }

  getProvinces(): Province[] {
    if (!this.provinces) {
      throw new Error("Data not loaded");
    }
    return this.provinces;
  }

  getDistrictsByProvince(provinceId: string): District[] {
    if (!this.districts) {
      throw new Error("Data not loaded");
    }
    return this.districts.filter(
      (district) => district.province_id === provinceId
    );
  }

  getDistrictsByProvinceName(
    provinceName: string,
    language: "en" | "si" | "ta" = "en"
  ): District[] {
    if (!this.districts || !this.provinces) {
      throw new Error("Data not loaded");
    }

    const province = this.provinces.find((p) => {
      switch (language) {
        case "si":
          return (
            p.province_name_si.toLowerCase() === provinceName.toLowerCase()
          );
        case "ta":
          return (
            p.province_name_ta.toLowerCase() === provinceName.toLowerCase()
          );
        default:
          return (
            p.province_name_en.toLowerCase() === provinceName.toLowerCase()
          );
      }
    });

    if (!province) {
      return [];
    }

    return this.getDistrictsByProvince(province.province_id);
  }

  getCitiesByDistrict(districtName: string): City[] {
    if (!this.citiesData) {
      throw new Error("Data not loaded");
    }
    return this.citiesData.filter(
      (city) =>
        city.district_name_en.toLowerCase() === districtName.toLowerCase()
    );
  }

  getCitiesByProvince(provinceName: string): City[] {
    if (!this.citiesData) {
      throw new Error("Data not loaded");
    }
    return this.citiesData.filter(
      (city) =>
        city.province_name_en.toLowerCase() === provinceName.toLowerCase()
    );
  }

  getCityByPostcode(postcode: string): City | undefined {
    if (!this.citiesData) {
      throw new Error("Data not loaded");
    }
    return this.citiesData.find((city) => city.postcode === postcode);
  }

  searchCities(
    searchTerm: string,
    language: "en" | "si" | "ta" = "en"
  ): City[] {
    if (!this.citiesData) {
      throw new Error("Data not loaded");
    }
    console.log("searchTerm:  " + searchTerm);
    const term = searchTerm.toLowerCase();
    try {
      switch (language) {
        case "si":
          return this.citiesData!.filter((city) => {
            const cityName = (city.city_name_si || "").toLowerCase();
            const subName = (city.sub_name_si || "").toLowerCase();
            return cityName.includes(term) || subName.includes(term);
          });
        case "ta":
          return this.citiesData!.filter((city) => {
            const cityName = (city.city_name_ta || "").toLowerCase();
            const subName = (city.sub_name_ta || "").toLowerCase();
            return cityName.includes(term) || subName.includes(term);
          });
        default: // 'en'
          return this.citiesData!.filter((city) => {
            const cityName = (city.city_name_en || "").toLowerCase();
            const subName = (city.sub_name_en || "").toLowerCase();
            return cityName.includes(term) || subName.includes(term);
          });
      }
    } catch (error) {
      console.error("Error during search:", error);
      return [];
    }
  }

  findNearbyCities(lat: number, lon: number, radius: number): City[] {
    if (!this.citiesData) {
      throw new Error("Data not loaded");
    }

    const getDistance = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ): number => {
      const R = 6371; // Earth's radius in kilometers
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    return this.citiesData.filter((city) => {
      const distance = getDistance(
        lat,
        lon,
        parseFloat(city.latitude),
        parseFloat(city.longitude)
      );
      return distance <= radius;
    });
  }
}

export default new DataService();
