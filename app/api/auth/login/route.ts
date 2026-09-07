import {
  proxyAuthRequest,
  validateLoginBody,
  type LoginBody,
} from "@/lib/server-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginBody | null;
  if (!body) {
    return Response.json({ ok: false, message: "Invalid JSON request body" }, { status: 400 });
  }

  const validationError = validateLoginBody(body);
  if (validationError) {
    return Response.json({ ok: false, message: validationError }, { status: 400 });
  }

  return proxyAuthRequest(
    "/auth/login",
    {
      email: body.email!.trim(),
      password: body.password!,
    },
    "Invalid email or password",
  );
}
