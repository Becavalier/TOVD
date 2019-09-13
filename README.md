# TOVD
A mobile app used for taking notes.

### Bundle

`npm run publish`


### IOS

`cd ./ios && pod install`

Then building application from Xcode.

### Appendix


Sometimes you need to setup a proxy for `curl` like tools to download Pods components from the remote server. Take the following codes for instance.

```bash
# here the port number must be the same as your local VPN;
export http_proxy=http://127.0.0.1:7890  
export https_proxy=$http_proxy
```
