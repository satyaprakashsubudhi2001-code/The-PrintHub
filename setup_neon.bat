call npm i -g neon@latest
echo Installed neon
call neon skills -y
echo Ran skills
call neon mcp -y
echo Ran mcp
call neon link --project-id proud-feather-05554260 --branch production -y
echo Ran link
call neon config init
echo Ran config init
call neon deploy
echo Ran deploy
