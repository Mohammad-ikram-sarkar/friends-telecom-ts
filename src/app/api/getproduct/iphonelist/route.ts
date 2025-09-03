import {connect} from "@/dbconfig/dbconfig";
import { NextResponse, NextRequest } from "next/server";

    import Product from "@/models/ProductModels";

export const GET = async (request: NextRequest) => {
    try {
        await connect();
        // Fetch iPhone products from the database
        const products = await Product.find();
        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching iPhone products:", error);
        return NextResponse.json({ error: "Failed to fetch iPhone products" }, { status: 500 });
    }
}

