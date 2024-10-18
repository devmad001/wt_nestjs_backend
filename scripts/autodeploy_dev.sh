cd /home/ubuntu/wt_fraud_tool_fe/current
git reset --hard HEAD
git fetch origin develop
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/develop)
if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
    git pull
    yarn install
    yarn build
    node /home/ubuntu/scripts/mail-hook.js FraudToolDev $REMOTE_COMMIT true
else
    echo "No new commits to deploy Fraud Tool."
fi


cd /home/ubuntu/wt_frontend_app/current
git reset --hard HEAD
git fetch origin develop
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/develop)
if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
    git pull
    yarn install
    yarn build
    node /home/ubuntu/scripts/mail-hook.js WatchDevFE $REMOTE_COMMIT true
else
    echo "No new commits to deploy WatchDev."
fi

cd /home/ubuntu/wt_backend_app/current
git reset --hard HEAD
git fetch origin develop
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/develop)
if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
    git pull
    yarn install
    yarn build
    pm2 reload all
    node /home/ubuntu/scripts/mail-hook.js WatchDev $REMOTE_COMMIT true
else
    echo "No new commits to deploy WatchDevBackend."
fi