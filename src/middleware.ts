import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  try {
    const res = await fetch(`${req.nextUrl.origin}/api/evento`);
    
    // Handle 404 case
    if (res.status === 404) {
      if (url.pathname !== "/acabou") {
        url.pathname = "/acabou";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    // Only proceed with json parsing if status is OK
    if (res.ok) {
      const data = await res.json();
      const agora = new Date();
      const inicioInscricao = new Date(data.dataInscricao);

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
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow request to continue without redirection
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/aguarde", "/inscricao/:path*"],
};