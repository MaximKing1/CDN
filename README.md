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
