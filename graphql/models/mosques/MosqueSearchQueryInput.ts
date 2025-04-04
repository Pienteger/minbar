import GeoSearchQuery from "../GeoSearchQuery";

export default interface MosqueSearchQueryInput {
  name?: string;
  geoSearchQuery?: GeoSearchQuery;
  userId?: number;
}


