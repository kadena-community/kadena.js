mkdir -p ~/.ssh
echo "$GITHUB_DEPLOY_KEY" > ~/.ssh/id_ed25519
chmod 0600 ~/.ssh/id_ed25519
git remote add origin git@github.com:kadena-community/kadena.js
GIT_SSH_COMMAND='ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_ed25519' git fetch origin main:refs/remotes/origin/main
npx turbo-ignore --fallback origin/main