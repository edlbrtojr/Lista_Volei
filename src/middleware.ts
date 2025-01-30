import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const res = await fetch(`${req.nextUrl.origin}/api/evento`);
  
  if (res.status === 404) {
    if (url.pathname !== "/acabou") {
      url.pathname = "/acabou";
      return NextResponse.redirect(url);
    }
  } else {
    const data = await res.json();
    const agora = new Date();
    const inicioInscricao = new Date(data.dataInscricao);

    // Handle redirections based on event timing
    if (url.pathname === "/") {
      if (agora < inicioInscricao) {
        url.pathname = "/aguarde";
        return NextResponse.redirect(url);
      }
    } else if (url.pathname === "/aguarde") {
      if (agora >= inicioInscricao) {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/aguarde", "/inscricao/:path*"],
};
