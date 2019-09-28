# TOVD
An iOS mobile app used for practicing English oral interpretation.

App Store: https://apps.apple.com/cn/app/tovd/id1479868644

### Bundle

`npm run publish-release`


### IOS

`cd ./ios && pod install`

Then building application from Xcode.

### Android 

Not support yet.


### Appendix

Sometimes you need to setup a proxy for `curl` like tools to download Pods components from the remote server. Take the following codes for instance.

```bash
# here the port number must be the same as your local VPN;
export http_proxy=http://127.0.0.1:7890  
export https_proxy=$http_proxy
```
