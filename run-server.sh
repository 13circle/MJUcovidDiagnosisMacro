#!/bin/sh

log="._server-output.txt"
tlog1="._server-temp-output-1.txt"
tlog2="._server-temp-output-2.txt"

command="node app.js"

getpid () {
    ps -U root a > $tlog1
    cat $tlog1 | awk '{$2=$3=$4=""; print;}' > $tlog2
    cat $tlog2 | awk '{for(i=2; i<=NF; ++i) printf "%s ", $i; print $1""}' > $tlog1
    cat $tlog1 | grep "^$command" | awk '{print $NF}' > $log
    echo $(cat $log)
    rm $log $tlog1 $tlog2
}

case $1 in
    start)
        sudo nohup $command > $log 2>&1 &
        echo "Server started"
        ;;
    stop)
        sudo kill -9 $(getpid)
        echo "Server stopped"
        ;;
    *)
        echo "Please enter 'start' or 'stop'"
        ;;
esac
