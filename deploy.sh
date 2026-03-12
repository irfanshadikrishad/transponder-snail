#!/bin/bash
git pull
cd client && npm ci && npm run build
sudo rsync -avP --delete dist/ /var/www/chat/
cd ../server && npm ci
pm2 restart chat --update-env
