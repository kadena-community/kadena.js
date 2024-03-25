#!/bin/bash
counter=0
max_attempts=30
retry_interval=10

while [[ $counter -lt $max_attempts ]]; do
    echo "Checking sandbox health..."
    response=$(curl -s 'http://localhost:9999/process/chainweb-data')
    is_ready=$(echo "$response" | jq -r '.is_ready')

    if [[ "$is_ready" == "Ready" ]]; then
        echo "Sandbox healthy"
        exit 0  # Success exit code
    else
        echo "Sandbox not healthy, retrying in $retry_interval seconds..."
        sleep $retry_interval
        counter=$((counter+1))
    fi
done

echo "Sandbox not healthy after $max_attempts attempts, exiting."
exit 1  # Error exit code
