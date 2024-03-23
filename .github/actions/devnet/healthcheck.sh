#!/bin/bash
counter=0
while [[ $counter -lt 30 ]]; do
    echo "Checking if all objects are running"
    response=$(curl -X 'GET' 'http://localhost:9999/process/chainweb-data' -H 'accept: application/json')
    is_ready=$(echo "$response" | jq -r '.is_ready')
    if [[ "$is_ready" == "Ready" ]]; then
        echo "All objects are running"
        exit 0  # Success exit code
    else
        echo "Some objects are not running"
        sleep 10  # Sleep for 10 seconds
        counter=$((counter+1))
    fi
done

echo "Sandbox not healthy, exiting."
exit 1  # Error exit code
