import glob
import re

files = glob.glob("src/app/api/admin/**/*.ts", recursive=True)

for file in files:
    if "utils.ts" in file:
        continue
    with open(file, "r") as f:
        content = f.read()

    # Determine depth for import path
    depth = file.count('/') - 3
    import_path = "../" * depth + "utils"
    
    if "fetchAdminBackend" not in content:
        content = content.replace('import { NextRequest, NextResponse } from "next/server";', 
                                  f'import {{ NextRequest, NextResponse }} from "next/server";\nimport {{ fetchAdminBackend }} from "{import_path}";')
        content = content.replace("import { NextRequest, NextResponse } from 'next/server';", 
                                  f"import {{ NextRequest, NextResponse }} from 'next/server';\nimport {{ fetchAdminBackend }} from '{import_path}';")
        content = content.replace("import { NextResponse } from 'next/server';", 
                                  f"import {{ NextResponse }} from 'next/server';\nimport {{ fetchAdminBackend }} from '{import_path}';")

        content = content.replace("await fetch(", "await fetchAdminBackend(")
        
        # Handle the early return if fetchAdminBackend returns NextResponse
        # We need to change:
        # const response = await fetchAdminBackend(...)
        # const data = await response.json()
        # to:
        # const response = await fetchAdminBackend(...)
        # if (response instanceof NextResponse) return response;
        # const data = await response.json()
        
        content = re.sub(r'(const response = await fetchAdminBackend\([^;]+;)', r'\1\n    if (response instanceof NextResponse) return response;', content)

        with open(file, "w") as f:
            f.write(content)

