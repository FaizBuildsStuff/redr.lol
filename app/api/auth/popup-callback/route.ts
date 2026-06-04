import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const dest = req.nextUrl.searchParams.get("dest") || "/dashboard";
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authenticating...</title>
      </head>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'oauth_callback', dest: '${dest}' }, '*');
            window.close();
          } else {
            window.location.href = '${dest}';
          }
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
