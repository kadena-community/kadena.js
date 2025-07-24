#!/bin/bash
counter=0
max_attempts=30
retry_interval=10

# Check chainweb node health
echo "Checking chainweb node health..."
while [[ $counter -lt $max_attempts ]]; do
    response=$(curl -s http://localhost:1848/health-check || echo "Failed to connect")
    
    if [[ "$response" == *"OK"* ]]; then
        echo "Chainweb node is healthy"
        chainweb_healthy=true
        break
    else
        echo "Chainweb node not healthy, retrying in $retry_interval seconds... (Attempt $counter/$max_attempts)"
        sleep $retry_interval
        counter=$((counter+1))
    fi
done

if [[ "$chainweb_healthy" != "true" ]]; then
    echo "Chainweb node not healthy after $max_attempts attempts, exiting."
    exit 1
fi

# Check GraphQL endpoint health via direct connection
echo "Checking GraphQL endpoint (direct) health..."
counter=0
while [[ $counter -lt $max_attempts ]]; do
    response=$(curl -s http://localhost:3000/graphql \
        -H "Content-Type: application/json" \
        -d '{"query": "{ __schema { queryType { name } } }"}' || echo "Failed to connect")
    
    if [[ "$response" == *"queryType"* ]]; then
        echo "GraphQL endpoint (direct) is healthy"
        graphql_direct_healthy=true
        break
    else
        echo "GraphQL endpoint (direct) not healthy, retrying in $retry_interval seconds... (Attempt $counter/$max_attempts)"
        sleep $retry_interval
        counter=$((counter+1))
    fi
done

if [[ "$graphql_direct_healthy" != "true" ]]; then
    echo "GraphQL endpoint (direct) not healthy after $max_attempts attempts, exiting."
    exit 1
fi

# Check GraphQL endpoint health via proxy (port 4000)
echo "Checking GraphQL endpoint (proxy) health..."
counter=0
while [[ $counter -lt $max_attempts ]]; do
    response=$(curl -s http://localhost:4000/graphql \
        -H "Content-Type: application/json" \
        -d '{"query": "{ __schema { queryType { name } } }"}' || echo "Failed to connect")
    
    if [[ "$response" == *"queryType"* ]]; then
        echo "GraphQL endpoint (proxy) is healthy"
        graphql_proxy_healthy=true
        break
    else
        echo "GraphQL endpoint (proxy) not healthy, retrying in $retry_interval seconds... (Attempt $counter/$max_attempts)"
        sleep $retry_interval
        counter=$((counter+1))
    fi
done

if [[ "$graphql_proxy_healthy" != "true" ]]; then
    echo "GraphQL endpoint (proxy) not healthy after $max_attempts attempts, exiting."
    exit 1
fi

# Check proxy server health (port 8080)
echo "Checking proxy server health..."
counter=0
while [[ $counter -lt $max_attempts ]]; do
    response=$(curl -s http://localhost:8080/ || echo "Failed to connect")
    
    if [[ "$response" == *"Kadena Devnet API"* ]]; then
        echo "Proxy server is healthy"
        proxy_healthy=true
        break
    else
        echo "Proxy server not healthy, retrying in $retry_interval seconds... (Attempt $counter/$max_attempts)"
        sleep $retry_interval
        counter=$((counter+1))
    fi
done

if [[ "$proxy_healthy" != "true" ]]; then
    echo "Proxy server not healthy after $max_attempts attempts, exiting."
    exit 1
fi

# If we get here, all services are healthy
echo "All services are healthy"
exit 0