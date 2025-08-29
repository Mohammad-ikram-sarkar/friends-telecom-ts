import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/UserModels";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    await connect();

    

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    return NextResponse.json({ message: "User created successfully" });
  } catch (err: any) {
    console.error(err);
    if (err.code === 11000) {
      return NextResponse.json({ message: "Username or email already exists" }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
