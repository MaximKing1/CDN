# CDN
```
↓    ( Incoming request )   ↓
↓            |||            ↓
↓   ---------------------   ↓
↓   |   Load Balencer   |   ↓ --> Directs the request to the most suitable server, 
↓   ---------------------   ↓
↓            |||            ↓
↓   ---------------------   ↓
↓   |        CDN        |   ↓ --> Serves the requested file on the cloest server to them
↓   ---------------------   ↓
↓            |||            ↓
↓   ---------------------   ↓
↓   |        CDN        |   ↓ --> Serves the requested file on the cloest server to them
↓   ---------------------   ↓
↓            |||            ↓
↓           /   \           ↓
↓         /       \         ↓
↓       /           \       ↓
↓ [ Forward ]    [ Replay ] ↓ --> Dispatch both middleware in separated flows (route forward and replay)
↓      \             /      ↓
↓       \           /       ↓
↓        \         /        ↓
↓    -------------------    ↓
↓    | C |    ↓ --> Serves the requested file on the cloest server to them
↓    -------------------    ↓
```
