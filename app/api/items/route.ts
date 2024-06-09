import { NextRequest, NextResponse } from "next/server";

export enum ItemAccess {
  STUDENT = "STUDENT",
  EDUCATOR = "EDUCATOR",
}

export type Item = {
  id: string;
  title: string;
  access: ItemAccess;
};
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json("dd");
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
