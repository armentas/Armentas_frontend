// Products
export interface Product {
    id?: number;
    title?: string;
    description?: string;
    collection?: string;
    sku?: string;
    brand?: string;
    // collection?: string[];
    category?: string;
    price?: number;
    colors?: string;
    sale?: boolean;
    discount?: number;
    weight?: number;
    stock?: number;
    new?: boolean;
    quantity?: number;
    tags?: string[];
    variants?: Variants[];
    images?: Images[];
}

export interface Variants {
    variant_id?: number;
    id?: number;
    sku?: string;
    size?: string;
    color?: string;
    image_id?: number;
}

export interface Images {
    id?: number;
    id_product?: number;
    img_key?: string;
    src?: string;
    img_url?: string;
    img_url2?: string;
    alt?: string;
}