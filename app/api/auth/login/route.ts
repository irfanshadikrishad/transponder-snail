import User from "@/models/user";
import database from "@/utils/database";
import pkg from "bcryptjs";

const { compareSync } = pkg;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log(email, password);

    await database();
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found!" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const isVerified = compareSync(password, user.password);
      if (isVerified) {
        return new Response(
          JSON.stringify({
            id: user._id,
            email: user.email,
            token: user.genJWT(),
            message: "Login Successful!",
          }),
          {
            status: 200,
          }
        );
      } else {
        return new Response(
          JSON.stringify({ message: "Invalid Credentials!" }),
          { status: 404 }
        );
      }
    }
  } catch (error) {
    console.log(`[login] ${(error as Error).message}`);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error!",
        error: `${(error as Error).message}`,
      }),
      {
        status: 500,
      }
    );
  }
}
