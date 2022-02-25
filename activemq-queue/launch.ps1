Start-Process -FilePath "node" -ArgumentList ".\active-mq-http-publisher.js"
Start-Process -FilePath "node" -ArgumentList ".\active-mq-subscriber.js test99"
Start-Process -FilePath "node" -ArgumentList ".\active-mq-subscriber.js test199"
