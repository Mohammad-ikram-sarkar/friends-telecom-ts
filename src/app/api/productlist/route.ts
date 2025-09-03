import {NextResponse , NextRequest} from 'next/server'; 
import {connect} from '@/dbconfig/dbconfig';
import Product from '@/models/ProductModels';

export async function POST(request:NextRequest){
    try {
        await connect();
        const body = await request.json();
        const newProduct = new Product(body);
        await newProduct.save();
        return NextResponse.json({message: "Product added successfully"}, {status: 201});
    } catch (error) {
        console.error("Error adding product:", error);
        return NextResponse.json({message: "Error adding product"}, {status: 500});
    }
}