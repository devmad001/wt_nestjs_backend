cd /home/ubuntu/wt_fraud_tool_fe/current
git reset --hard HEAD
git fetch origin staging
git checkout staging
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/staging)
if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
    git pull
    npm install
    npm run build
    node /home/ubuntu/scripts/mail-hook.js FraudToolDemo $REMOTE_COMMIT true
else
    echo "No new commits to deploy FraudToolDemo."
fi


cd /home/ubuntu/wt_frontend_app/current
git reset --hard HEAD
git fetch origin staging
git checkout staging
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/staging)
if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
    git pull
    npm install
    npm run build
    node /home/ubuntu/scripts/mail-hook.js WatchDemoFE $REMOTE_COMMIT true
else
    echo "No new commits to deploy WatchDemo."
fi

cd /home/ubuntu/wt_backend_app/current
git reset --hard HEAD
git fetch origin staging
git checkout staging
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/staging)
if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
    git pull
    yarn install
    yarn build
    pm2 reload all
    node /home/ubuntu/scripts/mail-hook.js WatchDemo $REMOTE_COMMIT true
else
    echo "No new commits to deploy WatchDemoBackend."
fi