export interface Medal {
    id: number;
    user_id: number;
    medal_id: number;
    get_at: string;
    is_wear: number;
    name: string;
    thumbnail: string;
    thumbnail2: string;
    source_type: string;
    source_id: string;
    source_text: string;
    get_condition: string;
    source_link: string | null;
}
