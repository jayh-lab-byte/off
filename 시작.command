#!/bin/zsh
cd "${0:A:h}"
if command -v node >/dev/null 2>&1; then
  off_node="$(command -v node)"
else
  off_node='/Users/test/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
fi
if [[ ! -x "$off_node" ]]; then
  echo 'Node.js 22 이상을 설치한 뒤 다시 실행해 주세요.'
  exit 1
fi
if [[ -f .env.local ]]; then
  exec "$off_node" --env-file=.env.local server.mjs
else
  echo '체험 모드로 시작합니다. 브라우저에서 http://127.0.0.1:4174 를 여세요.'
  OFF_DEMO=true exec "$off_node" server.mjs
fi
