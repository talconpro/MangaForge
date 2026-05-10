#!/bin/sh
set -e

# Wait for MinIO to be ready
sleep 3

mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb --ignore-existing local/mangaforge
