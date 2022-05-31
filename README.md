# 🚀 WasiCDN
Blazing Fast S3 Powered CDN, Powered By Fastify, S3 Compatible Buckets & Docker!

Core DockerHub: https://hub.docker.com/r/maximking19/wasicdn-core<br>
Slave Service DockerHub: https://hub.docker.com/r/maximking19/wasicdn-slave

**Features:**<br>
• Fastify Powered Backend<br>
• Built in Load Balancer which directs the connection to the closest server to the user<br>
• Each Slave CDN pulls files from your selected S3 Bucket or local system, each slave location has a copy and distributes them to users.<br>
• Directs users to the closest server by checking the IP Location and sending them to the correct way<br>

## CDN Replication
```
↓    (    Wasabi S3   )     ↓ --> Fetches files from the S3 Bucket
↓            |||            ↓
↓            |||            ↓
↓           /   \           ↓
↓         /       \         ↓
↓       /           \       ↓
↓[ UK Server ][ US Server ] ↓ --> Replicates the files from the S3 Bucket to each server (Replicates at every location) 
↓      \             /      ↓
↓       \           /       ↓
↓        \         /        ↓
↓   ---------------------   ↓
↓   |  Delivery System  |   ↓ --> The delivery system handles requests
↓   ---------------------   ↓
```

## How it works
```
↓     (    Request   )      ↓
↓           | b |           ↓
↓           | d |           ↓
↓   ---------------------   ↓
↓   |  Delivery System  |   ↓ --> Checks the request IP, and forwards there request to the closest server (Checks the IP's location to determine cloest server)
↓   ---------------------   ↓
↓            |||            ↓
↓   ---------------------   ↓
↓   |   Load Balancer   |   ↓ --> Redirects the request to the least stressed server in the location (UK1: 50%, UK2:25% - Would forward to UK2 as lowest System load)
↓   ---------------------   ↓ --> Load Balancer Not Realeased (W.I.P) 
↓            |||            ↓
↓   ---------------------   ↓
↓   |        CDN        |   ↓ --> Serves the requested file on the cloest server to them
↓   ---------------------   ↓
↓            |||            ↓
↓           /   \           ↓
↓         /       \         ↓
↓       /           \       ↓
↓ [  Data  ]     [ File ]   ↓ --> Dispatches both the Data and CDN File to the destination 
↓      \             /      ↓
↓       \           /       ↓
↓        \         /        ↓
↓    -------------------    ↓
↓        Destination        ↓ --> File received! :)
↓    -------------------    ↓

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FMaximKing1%2FCDN.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FMaximKing1%2FCDN?ref=badge_large)
