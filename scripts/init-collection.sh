#!/usr/bin/env bash
set -e

mongo <<EOF
use $DB
db.createUser({
  user:  '$USER',
  pwd: '$PSW',
  roles: [{
    role: 'readWrite',
    db: '$DB'
  }]
})
db.students.createIndex({ last_name:"hashed"})
sh.enableSharding('$DB')
sh.shardCollection( "$DB.students", { last_name:"hashed" })
EOF
