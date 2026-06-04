const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    let file = path.join(dir, f);
    if (fs.statSync(file).isDirectory()) {
      res = res.concat(walk(file));
    } else {
      res.push(file);
    }
  });
  return res;
}

const files = walk('e:/Programming Projects/redrose/app/api/user').filter(f => f.endsWith('.ts'));

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf-8');
  
  if (c.includes('checkUserAuth')) return; // already updated

  // Replace import
  c = c.replace(/import \{ verifyToken \} from ["']@\/lib\/session["'];/g, 'import { checkUserAuth, unauthorizedResponse } from "@/lib/user-auth";');
  
  // Replace auth block
  const oldAuthBlockRegex = /(?:const cookieStore = await cookies\(\);\n\s*)?const session(Cookie)? = (?:cookieStore\.get\([^)]+\)\?\.value|sessionCookie|session);\n\s*(?:if \(!session(Cookie)?\) \{\n\s*return NextResponse\.json\(\{ error: ["']Unauthorized["'] \}, \{ status: 401 \}\);\n\s*\}\n\s*)?const (?:user|session(?:User)?) = verifyToken\(session(Cookie)?\);\n\s*if \(!(?:user|session(?:User)?)(?: \|\| !(?:user|session(?:User)?)\.userId)?\) \{\n\s*return NextResponse\.json\(\{ error: ["']Unauthorized["'] \}, \{ status: 401 \}\);\n\s*\}/;
  
  // Custom manual replace if regex doesn't match easily
  const splitPoint = c.indexOf('verifyToken(');
  if (splitPoint !== -1) {
    // Actually regex is hard, let's just do a simpler replace based on lines
    const lines = c.split('\n');
    let outLines = [];
    let skipping = false;
    for (let i=0; i<lines.length; i++) {
        const line = lines[i];
        if (line.includes('const cookieStore = await cookies();') || 
            line.includes('const sessionCookie = cookieStore.get') ||
            line.includes('if (!sessionCookie)') ||
            line.includes('if (!session)') ||
            line.includes('const user = verifyToken') ||
            line.includes('const session = verifyToken') ||
            line.includes('verifyToken(') ||
            line.includes('unauthorizedResponse();')) 
        {
            // Just skip everything around the auth check and insert ours
            if (!skipping) {
               skipping = true;
               outLines.push('    const user = await checkUserAuth();\n    if (!user || !user.userId) return unauthorizedResponse();');
            }
            if (line.includes('return NextResponse.json({ error: "Unauthorized" }') || line.includes('return unauthorizedResponse()')) {
                // skip next closing brace
                i++; // skip '}'
                skipping = false;
            }
        } else {
           if (skipping && line.trim() === '}') {
               skipping = false;
           } else if (!skipping) {
               outLines.push(line);
           }
        }
    }
    // write
  }
});
