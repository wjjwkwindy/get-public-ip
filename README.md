# Get-Public-IP

get-public-ip is a node.js script for get your computer's public ip.

## Usage

```bash
git clone https://github.com/wjjwkwindy/get-public-ip

# copy config file
cp config.example.js config.js

# change config.js configure (dingdingWebhook, dingdingSecret, butterUptimeHeartbeats)

# copy log file
cp log.example.txt log.txt

# start script (once public up is changed, your dingding weill receive a DM)
node .\src\index.js
or
pm2 start .\src\index.js --name get-public-ip

# by default, script runs every 20 minutes.
```

## Contributing

Pull requests and issues are welcome. 

## License

[MIT](https://choosealicense.com/licenses/mit/)