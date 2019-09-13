# TOVD
A mobile app used for taking notes.

### IOS

`cd ./ios && pod install`


### Appendix


Sometimes you need to setup a proxy for curl like tools to download Pods components from the remote server. Take the following codes for instance.

```bash
export http_proxy=http://127.0.0.1:7890
export https_proxy=$http_proxy
```