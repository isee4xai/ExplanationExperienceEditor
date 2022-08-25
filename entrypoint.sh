#!/bin/sh

json-server --watch ServerJson/db.json &
gulp serve

wait 



