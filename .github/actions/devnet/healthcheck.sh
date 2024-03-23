#!/bin/bash
counter=0
while [[ $counter -lt 30 ]]; do
    echo "Checking if all objects are running"
    response=$(curl 'http://localhost:9999/process/chainweb-data')
    is_ready=$(echo "$response" | jq -r '.is_ready')
    if [[ "$is_ready" == "Ready" ]]; then
        echo "Sandbox healthy"
        exit 0  # Success exit code
    else
        echo "Sandbox not healthy, retrying in 10 seconds..."
        sleep 10  # Sleep for 10 seconds
        counter=$((counter+1))
    fi
done

echo "Sandbox not healthy, exiting."
exit 1  # Error exit code
