export type Submission = {
  id: string;
  created_at: string;
  location_text: string;
  message: string;
  lat: number | null;
  lng: number | null;
  media_url: string | null;
  media_type: string | null;
};

