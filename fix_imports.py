import glob
import re

files = glob.glob("src/app/api/admin/**/*.ts", recursive=True)

for file in files:
    if "utils.ts" in file:
        continue
    with open(file, "r") as f:
        content = f.read()

    # Replace relative imports of utils with absolute alias
    content = re.sub(r'from [\'"]\.+.*?/utils[\'"]', 'from "@/app/api/admin/utils"', content)

    with open(file, "w") as f:
        f.write(content)
